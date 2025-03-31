import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteAccountModalProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
}

const DeleteAccountModal = ({ open, onClose, onConfirm }: DeleteAccountModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[400px] rounded-2xl px-8 py-8 text-center">
                <h2 className="text-lg font-semibold mb-4">정말 탈퇴하시겠어요?</h2>
                <p className="text-sm text-gray-600 mb-6">
                    탈퇴하시면 모든 정보가 삭제되며 <br /> 복구되지 않습니다.
                </p>
                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={onClose}>
                        취소
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        탈퇴하기
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteAccountModal
