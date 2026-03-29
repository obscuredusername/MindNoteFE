import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, Mic, Paperclip } from 'lucide-react'

interface ChatInputProps {
    value: string
    onChange: (val: string) => void
    onSend: () => void
    isLoading: boolean
}

export function ChatInput({ value, onChange, onSend, isLoading }: ChatInputProps) {
    return (
        <div className="px-4 py-4 md:px-8 md:py-6 bg-transparent">
            <div className="max-w-3xl mx-auto relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/40 to-primary/40 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative flex items-end gap-2 bg-card/50 border border-accent/20 rounded-2xl p-2 shadow-xl backdrop-blur-md">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent rounded-xl h-9 w-9 shrink-0 mb-0.5">
                        <Paperclip className="w-5 h-5" />
                    </Button>
                    <textarea
                        placeholder="Ask anything..."
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                onSend()
                            }
                        }}
                        rows={1}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2.5 resize-none max-h-32 scrollbar-none outline-none placeholder:text-muted-foreground/40 font-medium"
                        disabled={isLoading}
                    />
                    <div className="flex items-center gap-1.5 pr-1 mb-0.5">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent rounded-xl h-9 w-9 shrink-0">
                            <Mic className="w-5 h-5" />
                        </Button>
                        <Button
                            onClick={onSend}
                            disabled={isLoading || !value.trim()}
                            size="icon"
                            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl h-9 w-9 shrink-0 shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 border-none"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
