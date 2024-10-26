import { Crown, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { SideNavigation } from "./navigation/SideNavigation";

const XP_FOR_LEVEL_UP = 1000;

interface PremiumFeaturesProps {
  isPremium: boolean;
  userLevel: number;
  userXp: number;
  onUpgradeToPremium: () => void;
}

export const PremiumFeatures = ({
  isPremium,
  userLevel,
  userXp,
  onUpgradeToPremium
}: PremiumFeaturesProps) => {
  return (
    <div className="flex flex-col space-y-4 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        {isPremium ? (
          <>
            <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
            <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-700 text-transparent bg-clip-text">
              AKALIBRE Premium
            </h3>
            <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
          </>
        ) : (
          <>
            <Crown className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold">AKALIBRE Premium</h3>
          </>
        )}
      </div>

      <div className="flex gap-6">
        <SideNavigation />
        
        <div className="flex-1 grid grid-cols-2 gap-4">
          {[
            { title: "Temas Exclusivos", locked: !isPremium },
            { title: "Entrada por Voz", locked: !isPremium },
            { title: "Priorização IA", locked: !isPremium },
            { title: "Templates Pro", locked: !isPremium },
            { title: "Colaboração", locked: !isPremium },
            { title: "Relatórios", locked: !isPremium },
            { title: "Suporte 24/7", locked: !isPremium },
          ].map((feature, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-center p-3 bg-white rounded-lg shadow-sm relative transition-all duration-300",
                feature.locked && "hover:scale-105"
              )}
            >
              {feature.locked && (
                <Lock className="w-4 h-4 absolute top-2 right-2 text-gray-400" />
              )}
              <span className={feature.locked ? "text-gray-400" : "text-gray-700"}>
                {feature.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <Badge variant="secondary">Nível {userLevel}</Badge>
          <Badge variant="outline">{userXp}/{XP_FOR_LEVEL_UP} XP</Badge>
          <Badge className={cn(
            "transition-all duration-300",
            isPremium ? "bg-gradient-to-r from-yellow-500 to-yellow-700" : "bg-gradient-to-r from-purple-500 to-blue-500"
          )}>
            {isPremium ? "Premium" : "Iniciante"}
          </Badge>
        </div>

        <Button
          onClick={onUpgradeToPremium}
          disabled={isPremium}
          className={cn(
            "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
            "transition-all duration-300 hover:scale-105"
          )}
        >
          {isPremium ? (
            <span className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Premium Ativo
            </span>
          ) : (
            "Torne-se AKALIBRE Premium"
          )}
        </Button>
      </div>
    </div>
  );
};