import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Mic, MicOff, Settings, Volume2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Conversation, VoiceSettings } from "@shared/schema";

export default function Chat() {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [voicePitch, setVoicePitch] = useState(10);
  const [voiceRate, setVoiceRate] = useState(10);
  const [selectedVoice, setSelectedVoice] = useState("Google US English Female");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const { data: voiceSettings } = useQuery<VoiceSettings>({
    queryKey: ["/api/voice-settings"],
  });

  useEffect(() => {
    if (voiceSettings) {
      setVoicePitch(voiceSettings.pitch);
      setVoiceRate(voiceSettings.rate);
      setSelectedVoice(voiceSettings.voiceName);
    }
  }, [voiceSettings]);

  // --- THIS useEffect IS REMOVED ---
  // We will load voices inside the speakText function instead
  //
  // useEffect(() => {
  //   const loadVoices = () => {
  //     const voices = window.speechSynthesis.getVoices();
  //     setAvailableVoices(voices);
  //   };
  //
  //   loadVoices();
  //   window.speechSynthesis.onvoiceschanged = loadVoices;
  // }, []);
  // ------------------------------------


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversations]);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return await apiRequest("POST", "/api/chat", { message });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      if (data.aiResponse) {
        console.log(data, data.aiResponse, "response")
      alert(data)
        speakText(data.aiResponse); // <-- This will now work
      }
      setTranscript("");
      setTextInput("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateVoiceSettingsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/voice-settings", {
        voiceName: selectedVoice,
        pitch: voicePitch,
        rate: voiceRate,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/voice-settings"] });
      toast({
        title: "Settings Saved",
        description: "Voice settings updated successfully.",
      });
    },
  });


  // --- THIS FUNCTION IS MODIFIED ---
  const speakText = (text: string) => {
          console.log("speaktest fun",text);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Function to actually speak
    const doSpeak = () => {
      const allVoices = window.speechSynthesis.getVoices();
      
      setAvailableVoices(allVoices); // Update state for the dropdown
      
      const voice = allVoices.find((v) => v.name === selectedVoice);
      if (voice) {

        utterance.voice = voice;
      }
      
      utterance.pitch = voicePitch / 10;
      utterance.rate = voiceRate / 10;
      window.speechSynthesis.speak(utterance);
    };

    // Check if voices are loaded. If not, wait for them.
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = doSpeak;
    } else {
      doSpeak();
    }
  };
  // ------------------------------------


  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);
      
      if (event.results[current].isFinal) {
        sendMessageMutation.mutate(transcriptText);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: "Error",
        description: "Failed to recognize speech. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSendText = () => {
    if (textInput.trim()) {
      sendMessageMutation.mutate(textInput);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-2xl">Voice Chat</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                  data-testid="button-toggle-settings"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[calc(100%-5rem)]">
              <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Loading conversations...</p>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <Volume2 className="h-16 w-16 text-muted-foreground" />
                    <p className="text-muted-foreground text-center">
                      Start a conversation by clicking the microphone<br />or typing below
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversations.map((conv) => (
                      <div key={conv.id} className="space-y-3">
                        <div className="flex justify-end">
                          <div className="bg-primary text-primary-foreground rounded-xl px-4 py-3 max-w-[80%]">
                            <p>{conv.userMessage}</p>
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-card border border-card-border rounded-xl px-4 py-3 max-w-[80%]">
                            <p>{conv.aiResponse}</p>
                            {conv.isSafetyAlert && (
                              <Badge variant="destructive" className="mt-2">
                                Safety Alert Detected
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {transcript && (
                  <div className="mt-4 p-3 bg-accent/20 border border-accent rounded-lg">
                    <p className="text-sm text-muted-foreground">Listening...</p>
                    <p>{transcript}</p>
                  </div>
                )}
              </ScrollArea>

              <div className="p-4 border-t space-y-3">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendText();
                      }
                    }}
                    className="min-h-[60px] resize-none"
                    data-testid="input-message"
                  />
                  <Button
                    onClick={handleSendText}
                    disabled={!textInput.trim() || sendMessageMutation.isPending}
                    data-testid="button-send-message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    variant={isListening ? "destructive" : "default"}
                    onClick={isListening ? stopListening : startListening}
                    disabled={sendMessageMutation.isPending}
                    className="w-16 h-16 rounded-full"
                    data-testid="button-voice-input"
                  >
                    {isListening ? (
                      <MicOff className="h-6 w-6" />
                    ) : (
                      <Mic className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {showSettings && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Voice Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Voice</Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger data-testid="select-voice">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVoices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Pitch: {(voicePitch / 10).toFixed(1)}</Label>
                  <Slider
                    value={[voicePitch]}
                    onValueChange={(value) => setVoicePitch(value[0])}
                    min={5}
                    max={20}
                    step={1}
                    data-testid="slider-pitch"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Speed: {(voiceRate / 10).toFixed(1)}</Label>
                  <Slider
                    value={[voiceRate]}
                    onValueChange={(value) => setVoiceRate(value[0])}
                    min={5}
                    max={20}
                    step={1}
                    data-testid="slider-rate"
                  />
                </div>

                <Button
                  onClick={() => updateVoiceSettingsMutation.mutate()}
                  className="w-full"
                  disabled={updateVoiceSettingsMutation.isPending}
                  data-testid="button-save-voice-settings"
                >
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
