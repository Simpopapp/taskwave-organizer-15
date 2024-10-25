import { Calendar, CheckSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Tarefas",
    icon: CheckSquare,
    path: "/missions",
    color: "text-green-500",
    bgHover: "hover:bg-green-50",
  },
  {
    title: "Compromissos",
    icon: Calendar,
    path: "/appointments",
    color: "text-blue-500",
    bgHover: "hover:bg-blue-50",
  },
  {
    title: "Equipe",
    icon: Users,
    path: "/team",
    color: "text-purple-500",
    bgHover: "hover:bg-purple-50",
  },
];

export const MainNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl mx-auto p-4">
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          variant="outline"
          className={cn(
            "flex-1 h-24 flex flex-col items-center gap-2 text-lg transition-all",
            "border-2 hover:scale-105",
            item.bgHover
          )}
          onClick={() => navigate(item.path)}
        >
          <item.icon className={cn("w-8 h-8", item.color)} />
          {item.title}
        </Button>
      ))}
    </div>
  );
};