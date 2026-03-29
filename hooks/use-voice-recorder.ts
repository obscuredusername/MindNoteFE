import { useState, useRef, useEffect, useCallback } from 'react'

interface UseVoiceRecorderReturn {
    isRecording: boolean
    recordingTime: number
    audioBlob: Blob | null
    showRecording: boolean
    startRecording: () => Promise<void>
    stopRecording: () => void
    clearRecording: () => void
    formatTime: (seconds: number) => string
}

/**
 * Encapsulates all MediaRecorder API logic for voice capture.
 * Handles permissions, audio chunking, blob creation, and timer management.
 *
 * @example
 * const { isRecording, audioBlob, startRecording, stopRecording } = useVoiceRecorder()
 */
export function useVoiceRecorder(): UseVoiceRecorderReturn {
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

    const startRecording = useCallback(async () => {
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
    }, [])

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
    }, [isRecording])

    const clearRecording = useCallback(() => {
        setAudioBlob(null)
        setRecordingTime(0)
        setShowRecording(false)
    }, [])

    const formatTime = useCallback((seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }, [])

    return {
        isRecording,
        recordingTime,
        audioBlob,
        showRecording,
        startRecording,
        stopRecording,
        clearRecording,
        formatTime,
    }
}
