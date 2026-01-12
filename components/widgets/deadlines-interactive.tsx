
"use client";

import { useOptimistic, useState, startTransition } from "react";
import { WidgetCard } from "@/components/widget-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarDays,
  Trash2,
  Plus,
  Pencil,
  Book,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DeadlineItem, DeadlineType } from "@/lib/deadlines-storage";
import { addDeadline, deleteDeadline, updateDeadline } from "@/app/actions/deadlines";
import { DEADLINE_CATEGORIES } from "@/lib/deadlines-storage";

interface Props {
  initialDeadlines: DeadlineItem[];
}

export function DeadlinesInteractive({ initialDeadlines }: Props) {
  const [deadlines, setDeadlines] = useOptimistic(
    initialDeadlines,
    (state, newItem: DeadlineItem | string) => {
      // Handle delete (string id)
      if (typeof newItem === "string") {
        return state.filter(d => d.id !== newItem);
      }
      // Handle update (item exists)
      const exists = state.find(d => d.id === newItem.id);
      if (exists) {
        return state.map(d => d.id === newItem.id ? newItem : d);
      }
      // Handle add
      return [...state, newItem];
    }
  );

  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DeadlineItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("23:59");
  const [type, setType] = useState<DeadlineType>("other");

  const sortedDeadlines = [...deadlines].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleEdit = (item: DeadlineItem) => {
    setEditingItem(item);
    setTitle(item.title);
    const d = new Date(item.date);
    setDate(d);
    setTime(format(d, "HH:mm"));
    setType(item.type);
    setIsOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setTitle("");
    setDate(new Date());
    setTime("23:59");
    setType("other");
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!title || !date) return;

    // Combine date and time
    const combinedDate = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);
    combinedDate.setHours(hours, minutes);

    const itemStr = {
      title,
      date: combinedDate.toISOString(),
      type,
    };

    setIsOpen(false);

    startTransition(async () => {
      if (editingItem) {
        // Optimistic Update
        const updated = { ...itemStr, id: editingItem.id };
        setDeadlines(updated);

        await updateDeadline(updated);
      } else {
        // Optimistic Add (temp ID for UI)
        const newItem = { ...itemStr, id: Math.random().toString() };
        setDeadlines(newItem);

        await addDeadline(itemStr);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      setDeadlines(id);
      await deleteDeadline(id);
    });
  };

  return (
    <WidgetCard
      title="Upcoming Deadlines"
      className="md:col-span-2"
      action={
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleAddNew}>
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Deadline" : "Add Deadline"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Midterm Exam" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={type} onValueChange={(v) => setType(v as DeadlineType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exam">
                      <div className="flex items-center gap-2">
                        <Book className="h-4 w-4" />
                        <span>Exam</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="project">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Project</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="holiday">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>Holiday</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="other">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>Other</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="date">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                        id="date"
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="time">Time</label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    id="time"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <ScrollArea className="h-[200px] pr-4">
        {sortedDeadlines.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground space-y-2 pt-8">
            <CalendarDays className="h-8 w-8 opacity-50" />
            <p>No upcoming deadlines</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDeadlines.map((item) => {
              const category = DEADLINE_CATEGORIES[item.type] || DEADLINE_CATEGORIES.other;
              const Icon = category.icon;
              const itemDate = new Date(item.date);
              const now = new Date();
              now.setHours(0, 0, 0, 0);

              const diffTime = itemDate.getTime() - now.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              let timeString = "";
              if (diffDays === 0) timeString = "Today";
              else if (diffDays === 1) timeString = "Tomorrow";
              else if (diffDays < 0) timeString = `${Math.abs(diffDays)} days ago`; // Should likely be filtered out but good fallback
              else timeString = `in ${diffDays} days`;

              const isUrgent = diffDays >= 0 && diffDays <= 7;

              return (
                <div
                  key={item.id}
                  className="group flex items-center gap-3 border-b border-border pb-3 last:border-0"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate pr-2">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(itemDate, "MMM d")}
                      {/* Show Time if it's not midnight default (optional polish) */}
                      {format(itemDate, "HH:mm") !== "00:00" && format(itemDate, "HH:mm") !== "23:59" && (
                        <span> at {format(itemDate, "h:mm a")}</span>
                      )}
                      {" • "}
                      <span className={cn("font-semibold", isUrgent ? "text-red-500" : "text-primary")}>
                        {timeString}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(item)}>
                      <Pencil className="h-3 w-3" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{item.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </WidgetCard>
  );
}
