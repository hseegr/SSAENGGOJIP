import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SkipSurveyDialogProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
}

const SkipSurveyDialog = ({ open, onClose, onConfirm }: SkipSurveyDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="text-center h-60">
                <DialogHeader className="text-lg font-semibold mt-8 px-2">
                    정말 나중에 설정하시겠어요?
                </DialogHeader>
                <div className="flex justify-center gap-8 pt-4 mb-4">
                    <Button
                        variant="default"
                        onClick={onConfirm}
                        className="px-4 py-2 w-52 h-12 rounded bg-ssaeng-purple text-white hover:bg-[#5f5fc7]"
                    >
                        네, 메인으로 갈게요
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="px-4 py-2 w-52 h-12 rounded bg-ssaeng-gray-1 hover:bg-ssaeng-gray-2"
                    >
                        아니요
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SkipSurveyDialog
