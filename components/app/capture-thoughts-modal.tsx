'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Send, Mic, Square, Trash2 } from 'lucide-react'

interface CaptureThoughtsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CaptureThoughtsModal({ open, onOpenChange }: CaptureThoughtsModalProps) {
  const [thought, setThought] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [showRecording, setShowRecording] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setShowRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const clearRecording = () => {
    setAudioBlob(null)
    setRecordingTime(0)
    setShowRecording(false)
  }

  const handleSubmit = async () => {
    if (!thought.trim() && !audioBlob) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('content', thought)
      formData.append('timestamp', new Date().toISOString())
      
      if (audioBlob) {
        formData.append('audioFile', audioBlob, 'voice-note.webm')
      }

      // Send to your backend endpoint
      // Your backend will handle categorization (note, reminder, todo, etc)
      const response = await fetch('/api/capture-thought', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setThought('')
        setAudioBlob(null)
        setRecordingTime(0)
        setShowRecording(false)
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Error capturing thought:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tell Me Your Thoughts</DialogTitle>
          <DialogDescription>
            Write or record what's on your mind. I'll organize it for you.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind? Share your thoughts, ideas, reminders, or tasks..."
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            className="min-h-32 resize-none"
            disabled={isLoading || isRecording}
          />

          {/* Voice Recording Section */}
          {showRecording && (
            <div className="border border-accent/30 rounded-lg p-4 bg-accent/5">
              {isRecording ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-foreground">Recording</span>
                    </div>
                    <span className="text-sm font-mono text-muted-foreground">{formatTime(recordingTime)}</span>
                  </div>
                  {/* Waveform Visualization */}
                  <div className="flex items-center justify-center gap-1 h-8">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-accent rounded-full transition-all"
                        style={{
                          height: `${20 + Math.random() * 20}px`,
                          animation: isRecording ? `wave 0.5s ease-in-out ${i * 0.05}s infinite` : 'none',
                        }}
                      />
                    ))}
                  </div>
                  <Button
                    onClick={stopRecording}
                    variant="outline"
                    className="w-full gap-2"
                    size="sm"
                  >
                    <Square className="w-4 h-4" />
                    Stop Recording
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Voice Note</p>
                    <p className="text-muted-foreground text-xs">{formatTime(recordingTime)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={startRecording}
                      variant="outline"
                      className="flex-1 gap-2"
                      size="sm"
                    >
                      <Mic className="w-4 h-4" />
                      Record Again
                    </Button>
                    <Button
                      onClick={clearRecording}
                      variant="outline"
                      className="gap-2"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Start Recording Button */}
          {!showRecording && (
            <Button
              onClick={startRecording}
              variant="outline"
              className="w-full gap-2"
              disabled={isLoading}
            >
              <Mic className="w-4 h-4" />
              Add Voice Note
            </Button>
          )}
          
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading || isRecording}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={(!thought.trim() && !audioBlob) || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const waveStyle = `
  @keyframes wave {
    0%, 100% { height: 20px; }
    50% { height: 40px; }
  }
`

// Add this style to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = waveStyle
  document.head.appendChild(style)
}
