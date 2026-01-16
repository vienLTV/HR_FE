"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/app/utils/api";
import { Spinner } from "@/app/components/Spinner";
import { useI18n } from "@/app/providers/LanguageProvider";

type Team = {
  teamId: string;
  name: string;
  description: string;
  phoneNumber: string;
  email: string;
  location: string;
  departmentId: string;
};

type Department = {
  departmentId: string;
  name: string;
};

export default function TeamPage() {
  const { t } = useI18n();
  const [teams, setTeams] = useState<Team[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams();
    fetchDepartments();
  }, []);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/teams/");
      const data = await response.json();
      setTeams(data.data);
      setError(null);
    } catch (err) {
      console.log(err);
      setError(t("team.error"));
      toast({
        title: "Error",
        description: t("team.error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments/");
      const data = await response.json();
      setDepartments(data.data);
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: t("team.error.departments"),
        variant: "destructive",
      });
    }
  };

  const handleCreate = () => {
    setCurrentTeam(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (team: Team) => {
    setCurrentTeam(team);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (team: Team) => {
    setTeamToDelete(team);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!teamToDelete) return;

    try {
      await api.delete(`/teams/${teamToDelete.teamId}`);
      setTeams(teams.filter((t) => t.teamId !== teamToDelete.teamId));
      setIsDeleteDialogOpen(false);
      setTeamToDelete(null);
      toast({
        title: "Success",
        description: `${t("team.success.deleted")} "${teamToDelete.name}" ${t(
          "team.success.deleted.suffix"
        )}`,
      });
    } catch (err) {
      console.log(err);
      setError(t("team.error.delete"));
      toast({
        title: "Error",
        description: t("team.error.delete"),
        variant: "destructive",
      });
    }
  };

  const handleSave = async (team: Team) => {
    try {
      if (currentTeam) {
        await api.put(`/teams/${team.teamId}`, team);
        setTeams(teams.map((t) => (t.teamId === team.teamId ? team : t)));
        toast({
          title: "Success",
          description: `${t("team.success.updated")} "${team.name}" ${t(
            "team.success.updated.suffix"
          )}`,
        });
      } else {
        const response = await api.post("/teams", team);
        const data = await response.json();
        setTeams([...teams, data.data]);
        toast({
          title: "Success",
          description: `${t("team.success.created")} ${team.name} ${t(
            "team.success.created.suffix"
          )}`,
        });
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.log(err);
      setError(t("team.error.save"));
      toast({
        title: "Error",
        description: t("team.error.save"),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="w-full p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full p-4">
      <div className="">
        <h1 className="text-primary-heading">{t("team.title")}</h1>
        <p className="text-gray-500 text-md">{t("team.subtitle")}</p>
      </div>

      <Button onClick={handleCreate} className="button-primary hover:bg-white mt-3">
        <Plus className="mr-2 h-4 w-4" /> {t("team.create")}
      </Button>

      <Table className="bg-white border border-gray-400 mt-5">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">{t("team.table.name")}</TableHead>
            <TableHead className="font-semibold">{t("team.table.description")}</TableHead>
            <TableHead className="font-semibold">{t("team.table.phoneNumber")}</TableHead>
            <TableHead className="font-semibold">{t("team.table.email")}</TableHead>
            <TableHead className="font-semibold">{t("team.table.location")}</TableHead>
            <TableHead className="font-semibold">{t("team.table.department")}</TableHead>
            <TableHead className="text-right font-semibold">{t("team.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.teamId}>
              <TableCell className="font-medium">{team.name}</TableCell>
              <TableCell>{team.description}</TableCell>
              <TableCell>{team.phoneNumber}</TableCell>
              <TableCell>{team.email}</TableCell>
              <TableCell>{team.location}</TableCell>
              <TableCell>
                {departments.find((d) => d.departmentId === team.departmentId)?.name || "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(team)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(team)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary-md">
              {currentTeam ? t("team.dialog.edit") : t("team.dialog.create")}
            </DialogTitle>
          </DialogHeader>
          <TeamForm team={currentTeam} departments={departments} onSave={handleSave} />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary-md">{t("team.dialog.delete.confirm")}</DialogTitle>
            <DialogDescription>
              {t("team.dialog.delete.message")}{" "}
              <span className="font-semibold text-black">{teamToDelete?.name}</span>?{" "}
              {t("team.dialog.delete.warning")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="button-primary hover:bg-white"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t("team.dialog.delete.cancel")}
            </Button>
            <Button
              className="button-red hover:bg-white"
              variant="destructive"
              onClick={handleDelete}
            >
              {t("team.dialog.delete.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TeamForm({
  team,
  departments,
  onSave,
}: {
  team: Team | null;
  departments: Department[];
  onSave: (team: Team) => void;
}) {
  const { t } = useI18n();
  const [name, setName] = useState(team?.name || "");
  const [description, setDescription] = useState(team?.description || "");
  const [phoneNumber, setPhoneNumber] = useState(team?.phoneNumber || "");
  const [email, setEmail] = useState(team?.email || "");
  const [location, setLocation] = useState(team?.location || "");
  const [departmentId, setDepartmentId] = useState(team?.departmentId || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      teamId: team?.teamId || "",
      name,
      description,
      phoneNumber,
      email,
      location,
      departmentId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">{t("team.dialog.label.name")}</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">{t("team.dialog.label.description")}</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="phoneNumber">{t("team.dialog.label.phoneNumber")}</Label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">{t("team.dialog.label.email")}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">{t("team.dialog.label.location")}</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="department">{t("team.dialog.label.department")}</Label>
        <Select value={departmentId} onValueChange={setDepartmentId}>
          <SelectTrigger>
            <SelectValue placeholder={t("team.dialog.selectDepartment")} />
          </SelectTrigger>
          <SelectContent>
            {departments.map((department) => (
              <SelectItem key={department.departmentId} value={department.departmentId}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button className="button-primary hover:bg-white" type="submit">
        {t("team.dialog.save")}
      </Button>
    </form>
  );
}
