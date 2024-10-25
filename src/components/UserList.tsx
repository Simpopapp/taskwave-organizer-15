import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";

interface UserListProps {
  users: User[];
  onEditUser: (user: User) => void;
}

export const UserList = ({ users, onEditUser }: UserListProps) => {
  const { canEditUser } = useAuth();
  const { toast } = useToast();

  const handleEditClick = (user: User) => {
    if (!canEditUser(user.id)) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para editar este usuário.",
        variant: "destructive",
      });
      return;
    }
    onEditUser(user);
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {user.role === 'leader' ? 'Líder' : 'Membro'}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => handleEditClick(user)}
              disabled={!canEditUser(user.id)}
            >
              Editar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};