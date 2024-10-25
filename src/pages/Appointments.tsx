import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

export default function Appointments() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Calendar className="w-6 h-6" />
        Compromissos
      </h1>

      <div className="grid gap-4">
        {[
          {
            title: "Reunião de Equipe",
            time: "10:00",
            date: "2024-02-20",
            type: "online",
          },
          {
            title: "Review de Projeto",
            time: "14:30",
            date: "2024-02-20",
            type: "presencial",
          },
        ].map((appointment, index) => (
          <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <Clock className="w-6 h-6 text-blue-500" />
              <div className="flex-1">
                <h3 className="font-medium">{appointment.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(appointment.date).toLocaleDateString()} às{" "}
                  {appointment.time}
                </p>
              </div>
              <Badge variant="outline">{appointment.type}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}