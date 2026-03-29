import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface ChatInputProps {
    value: string
    onChange: (val: string) => void
    onSend: () => void
    isLoading: boolean
}

export function ChatInput({ value, onChange, onSend, isLoading }: ChatInputProps) {
    return (
        <div className="p-4 border-t border-accent/10 bg-card/50 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto flex gap-2">
                <Input
                    placeholder="Type a message..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSend()}
                    className="flex-1 bg-background border-accent/20 focus-visible:ring-accent"
                    disabled={isLoading}
                />
                <Button
                    onClick={onSend}
                    disabled={isLoading || !value.trim()}
                    className="bg-accent hover:bg-accent/90"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
