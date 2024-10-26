import { CheckSquare, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Tarefas",
    icon: CheckSquare,
    path: "/missions",
    color: "text-green-500",
  },
  {
    title: "Compromissos",
    icon: Calendar,
    path: "/appointments",
    color: "text-blue-500",
  },
  {
    title: "Equipe",
    icon: Users,
    path: "/team",
    color: "text-purple-500",
  },
];

export const SideNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 w-48 p-4">
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-lg",
            "hover:bg-primary/10 transition-all"
          )}
          onClick={() => navigate(item.path)}
        >
          <item.icon className={cn("w-5 h-5", item.color)} />
          {item.title}
        </Button>
      ))}
    </div>
  );
};