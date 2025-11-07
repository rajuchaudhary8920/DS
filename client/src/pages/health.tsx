import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Calendar, Heart, Droplet, Moon, Dumbbell, Smile, Frown, Meh } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CycleTracking, MoodEntry, WellnessMetric } from "@shared/schema";
import { format, differenceInDays } from "date-fns";

export default function Health() {
  const { toast } = useToast();
  const [isCycleDialogOpen, setIsCycleDialogOpen] = useState(false);
  const [isMoodDialogOpen, setIsMoodDialogOpen] = useState(false);
  const [isWellnessDialogOpen, setIsWellnessDialogOpen] = useState(false);
  
  const [cycleForm, setCycleForm] = useState({
    startDate: new Date().toISOString().split("T")[0],
    cycleLength: 28,
    periodLength: 5,
  });
  
  const [moodForm, setMoodForm] = useState({
    mood: "happy",
    notes: "",
  });
  
  const [wellnessForm, setWellnessForm] = useState({
    date: new Date().toISOString().split("T")[0],
    waterIntake: 0,
    sleepHours: 0,
    exerciseMinutes: 0,
  });

  const { data: cycles = [] } = useQuery<CycleTracking[]>({
    queryKey: ["/api/cycle-tracking"],
  });

  const { data: moods = [] } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries"],
  });

  const { data: wellness = [] } = useQuery<WellnessMetric[]>({
    queryKey: ["/api/wellness-metrics"],
  });

  const addCycleMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/cycle-tracking", {
        ...cycleForm,
        startDate: new Date(cycleForm.startDate).toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cycle-tracking"] });
      setIsCycleDialogOpen(false);
      toast({ title: "Cycle Logged", description: "Cycle tracking entry added." });
    },
  });

  const addMoodMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/mood-entries", moodForm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
      setIsMoodDialogOpen(false);
      setMoodForm({ mood: "happy", notes: "" });
      toast({ title: "Mood Logged", description: "Mood entry added successfully." });
    },
  });

  const addWellnessMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/wellness-metrics", {
        ...wellnessForm,
        date: new Date(wellnessForm.date).toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness-metrics"] });
      setIsWellnessDialogOpen(false);
      toast({ title: "Wellness Logged", description: "Wellness metrics added." });
    },
  });

  const latestCycle = cycles[0];
  const currentDay = latestCycle
    ? differenceInDays(new Date(), new Date(latestCycle.startDate)) + 1
    : 0;

  const moodIcons = {
    happy: { icon: Smile, color: "text-chart-1" },
    calm: { icon: Heart, color: "text-chart-3" },
    anxious: { icon: Frown, color: "text-chart-4" },
    sad: { icon: Frown, color: "text-muted-foreground" },
    energetic: { icon: Dumbbell, color: "text-chart-2" },
    stressed: { icon: Frown, color: "text-destructive" },
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">Health Dashboard</h1>
        <p className="text-muted-foreground">
          Track your cycle, mood, and wellness metrics
        </p>
      </div>

      <Tabs defaultValue="cycle" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cycle" data-testid="tab-cycle">Cycle</TabsTrigger>
          <TabsTrigger value="mood" data-testid="tab-mood">Mood</TabsTrigger>
          <TabsTrigger value="wellness" data-testid="tab-wellness">Wellness</TabsTrigger>
        </TabsList>

        <TabsContent value="cycle" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Cycle Tracking
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Monitor your menstrual cycle
                  </CardDescription>
                </div>
                <Dialog open={isCycleDialogOpen} onOpenChange={setIsCycleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-log-cycle">
                      <Plus className="h-4 w-4 mr-2" />
                      Log Cycle
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Log Cycle Start</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={cycleForm.startDate}
                          onChange={(e) => setCycleForm({ ...cycleForm, startDate: e.target.value })}
                          data-testid="input-cycle-start-date"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cycleLength">Cycle Length (days)</Label>
                        <Input
                          id="cycleLength"
                          type="number"
                          value={cycleForm.cycleLength}
                          onChange={(e) => setCycleForm({ ...cycleForm, cycleLength: parseInt(e.target.value) })}
                          data-testid="input-cycle-length"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="periodLength">Period Length (days)</Label>
                        <Input
                          id="periodLength"
                          type="number"
                          value={cycleForm.periodLength}
                          onChange={(e) => setCycleForm({ ...cycleForm, periodLength: parseInt(e.target.value) })}
                          data-testid="input-period-length"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => addCycleMutation.mutate()} data-testid="button-save-cycle">
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {latestCycle ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-primary">{currentDay}</p>
                        <p className="text-sm text-muted-foreground">Day</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      Started {format(new Date(latestCycle.startDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cycle Progress</span>
                      <span>{currentDay} / {latestCycle.cycleLength} days</span>
                    </div>
                    <Progress value={(currentDay / latestCycle.cycleLength) * 100} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">No cycle data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mood" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Mood Tracking
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Log how you're feeling
                  </CardDescription>
                </div>
                <Dialog open={isMoodDialogOpen} onOpenChange={setIsMoodDialogOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-log-mood">
                      <Plus className="h-4 w-4 mr-2" />
                      Log Mood
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>How are you feeling?</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(moodIcons).map(([mood, { icon: Icon, color }]) => (
                          <Button
                            key={mood}
                            variant={moodForm.mood === mood ? "default" : "outline"}
                            onClick={() => setMoodForm({ ...moodForm, mood })}
                            className="h-20 flex-col gap-2"
                            data-testid={`button-mood-${mood}`}
                          >
                            <Icon className={`h-6 w-6 ${moodForm.mood === mood ? "" : color}`} />
                            <span className="capitalize text-xs">{mood}</span>
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes (optional)</Label>
                        <Textarea
                          id="notes"
                          value={moodForm.notes}
                          onChange={(e) => setMoodForm({ ...moodForm, notes: e.target.value })}
                          placeholder="Any thoughts or observations..."
                          data-testid="input-mood-notes"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => addMoodMutation.mutate()} data-testid="button-save-mood">
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {moods.length > 0 ? (
                <div className="space-y-3">
                  {moods.slice(0, 5).map((entry) => {
                    const MoodIcon = moodIcons[entry.mood as keyof typeof moodIcons]?.icon || Meh;
                    const colorClass = moodIcons[entry.mood as keyof typeof moodIcons]?.color || "text-muted-foreground";
                    return (
                      <Card key={entry.id} className="hover-elevate">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <MoodIcon className={`h-5 w-5 ${colorClass} mt-1`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <Badge variant="outline" className="capitalize">{entry.mood}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(entry.createdAt), "MMM dd, yyyy")}
                                </span>
                              </div>
                              {entry.notes && (
                                <p className="text-sm text-muted-foreground">{entry.notes}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">No mood entries yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wellness" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Wellness Metrics
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Track water, sleep, and exercise
                  </CardDescription>
                </div>
                <Dialog open={isWellnessDialogOpen} onOpenChange={setIsWellnessDialogOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-log-wellness">
                      <Plus className="h-4 w-4 mr-2" />
                      Log Metrics
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Log Wellness Metrics</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={wellnessForm.date}
                          onChange={(e) => setWellnessForm({ ...wellnessForm, date: e.target.value })}
                          data-testid="input-wellness-date"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="water">Water Intake (ml)</Label>
                        <Input
                          id="water"
                          type="number"
                          value={wellnessForm.waterIntake}
                          onChange={(e) => setWellnessForm({ ...wellnessForm, waterIntake: parseInt(e.target.value) })}
                          data-testid="input-water-intake"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sleep">Sleep (hours)</Label>
                        <Input
                          id="sleep"
                          type="number"
                          value={wellnessForm.sleepHours || ""}
                          onChange={(e) => setWellnessForm({ ...wellnessForm, sleepHours: parseInt(e.target.value) || 0 })}
                          data-testid="input-sleep-hours"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exercise">Exercise (minutes)</Label>
                        <Input
                          id="exercise"
                          type="number"
                          value={wellnessForm.exerciseMinutes || ""}
                          onChange={(e) => setWellnessForm({ ...wellnessForm, exerciseMinutes: parseInt(e.target.value) || 0 })}
                          data-testid="input-exercise-minutes"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => addWellnessMutation.mutate()} data-testid="button-save-wellness">
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {wellness.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-chart-3/5">
                    <CardContent className="p-4 text-center space-y-2">
                      <Droplet className="h-8 w-8 text-chart-3 mx-auto" />
                      <p className="text-2xl font-bold">{wellness[0]?.waterIntake || 0} ml</p>
                      <p className="text-sm text-muted-foreground">Water Today</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-chart-2/5">
                    <CardContent className="p-4 text-center space-y-2">
                      <Moon className="h-8 w-8 text-chart-2 mx-auto" />
                      <p className="text-2xl font-bold">{wellness[0]?.sleepHours || 0} hrs</p>
                      <p className="text-sm text-muted-foreground">Sleep</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-chart-1/5">
                    <CardContent className="p-4 text-center space-y-2">
                      <Dumbbell className="h-8 w-8 text-chart-1 mx-auto" />
                      <p className="text-2xl font-bold">{wellness[0]?.exerciseMinutes || 0} min</p>
                      <p className="text-sm text-muted-foreground">Exercise</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">No wellness data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
