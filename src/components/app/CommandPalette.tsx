import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useStore } from "@/lib/store";

export function CommandPalette() {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search applications by role or company…" />
      <CommandList>
        <CommandEmpty>No applications found.</CommandEmpty>
        <CommandGroup heading="Applications">
          {state.applications.map(a => (
            <CommandItem
              key={a.id}
              value={`${a.role} ${a.company}`}
              onSelect={() => {
                dispatch({ type: "select", id: a.id });
                dispatch({ type: "view", view: "appdetail" });
                setOpen(false);
              }}
            >
              <span className="font-medium">{a.role}</span>
              <span className="ml-2 text-xs text-muted-foreground">{a.company}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
