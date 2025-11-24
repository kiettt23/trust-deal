import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { CONTRACT } from "@/contracts/config";
import { toast } from "sonner";
import { SuiObjectChangeCreated } from "@mysten/sui/client";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import confetti from "canvas-confetti";

export const useEscrow = () => {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const client = new SuiClient({ url: getFullnodeUrl("devnet") });

  // Tạo Deal & Trả về Deal ID
  const createDeal = async (
    price: number,
    onSuccess?: (dealId: string) => void
  ) => {
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${CONTRACT.packageId}::${CONTRACT.module}::create_deal`,
        arguments: [tx.pure.u64(price)],
      });

      toast.loading("Đang khởi tạo hợp đồng...");

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: async (result) => {
            const txDetails = await client.waitForTransaction({
              digest: result.digest,
              options: { showObjectChanges: true },
            });

            toast.dismiss();
            toast.success("Khởi tạo thành công! Đang chuyển hướng...");
            confetti();

            if (txDetails.objectChanges) {
              const createdObject = txDetails.objectChanges.find(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (change: any) =>
                  change.type === "created" &&
                  change.objectType.includes(`${CONTRACT.module}::Deal`)
              ) as SuiObjectChangeCreated | undefined;

              if (createdObject) {
                console.log("New Deal ID:", createdObject.objectId);
                if (onSuccess) onSuccess(createdObject.objectId);
              } else {
                toast.error("Không tìm thấy Deal ID! Hãy kiểm tra console.");
                console.log("Changes:", txDetails.objectChanges);
              }
            }
          },
          onError: (error) => {
            toast.dismiss();
            toast.error("Thất bại: " + error.message);
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tạo transaction");
    }
  };

  // Nạp tiền
  const deposit = async (
    dealId: string,
    amount: number,
    onSuccess?: () => void
  ) => {
    try {
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);

      tx.moveCall({
        target: `${CONTRACT.packageId}::${CONTRACT.module}::deposit`,
        arguments: [tx.object(dealId), coin],
      });

      toast.loading("Đang nạp tiền...");

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            toast.dismiss();
            toast.success("Nạp tiền thành công!");
            if (onSuccess) onSuccess();
          },
          onError: (err) => {
            toast.dismiss();
            toast.error(err.message);
          },
        }
      );
    } catch (e) {
      console.error(e);
      toast.error("Lỗi deposit");
    }
  };

  // Xác nhận
  const confirmDelivery = async (dealId: string, onSuccess?: () => void) => {
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${CONTRACT.packageId}::${CONTRACT.module}::confirm_delivery`,
        arguments: [tx.object(dealId)],
      });

      toast.loading("Đang mở két...");
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            toast.dismiss();
            toast.success("Giao dịch hoàn tất!");
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            if (onSuccess) onSuccess();
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } catch (e) {
      console.error(e);
      toast.error("Lỗi confirm");
    }
  };

  // Hủy kèo (Refund)
  const cancelDeal = async (dealId: string, onSuccess?: () => void) => {
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${CONTRACT.packageId}::${CONTRACT.module}::cancel_deal`,
        arguments: [tx.object(dealId)],
      });

      toast.loading("Đang xử lý hoàn tiền...");
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            toast.dismiss();
            toast.success("Đã hủy kèo! Tiền đã được hoàn trả.");
            if (onSuccess) onSuccess();
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } catch (e) {
      console.error(e);
      toast.error("Lỗi cancel");
    }
  };

  return { createDeal, deposit, confirmDelivery, cancelDeal };
};
