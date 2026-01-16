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
import { api } from "@/app/utils/api";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/app/components/Spinner";
import { useI18n } from "@/app/providers/LanguageProvider";

type JobTitle = {
  jobTitleId: string;
  title: string;
  description: string;
};

export default function JobTitlePage() {
  const { t } = useI18n();
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentJobTitle, setCurrentJobTitle] = useState<JobTitle | null>(null);
  const [jobTitleToDelete, setJobTitleToDelete] = useState<JobTitle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobTitles();
  }, []);

  const fetchJobTitles = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/job-titles/");
      const data = await response.json();
      setJobTitles(data.data);
      setError(null);
    } catch (err) {
      console.log(err);
      setError(t("jobTitle.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentJobTitle(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (jobTitle: JobTitle) => {
    setCurrentJobTitle(jobTitle);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (jobTitle: JobTitle) => {
    setJobTitleToDelete(jobTitle);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!jobTitleToDelete) return;

    try {
      await api.delete(`/job-titles/${jobTitleToDelete.jobTitleId}`);
      setJobTitles(jobTitles.filter((jt) => jt.jobTitleId !== jobTitleToDelete.jobTitleId));
      setIsDeleteDialogOpen(false);
      setJobTitleToDelete(null);
      toast({
        title: "Success",
        description: `${t("jobTitle.success.deleted")} "${jobTitleToDelete.title}" ${t(
          "jobTitle.success.deleted.suffix"
        )}`,
      });
    } catch (err) {
      console.log(err);
      setError(t("jobTitle.error.delete"));
      toast({
        title: "Error",
        description: t("jobTitle.error.delete"),
        variant: "destructive",
      });
    }
  };

  const handleSave = async (jobTitle: JobTitle) => {
    try {
      if (currentJobTitle) {
        await api.put(`/job-titles/${jobTitle.jobTitleId}`, jobTitle);
        setJobTitles(
          jobTitles.map((jt) => (jt.jobTitleId === jobTitle.jobTitleId ? jobTitle : jt))
        );
        toast({
          title: "Success",
          description: `${t("jobTitle.success.updated")} "${jobTitle.title}" ${t(
            "jobTitle.success.updated.suffix"
          )}`,
        });
      } else {
        const response = await api.post("/job-titles", jobTitle);
        const data = await response.json();
        setJobTitles([...jobTitles, data.data]);
        toast({
          title: "Success",
          description: `${t("jobTitle.success.created")} "${jobTitle.title}" ${t(
            "jobTitle.success.created.suffix"
          )}`,
        });
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.log(err);
      setError(t("jobTitle.error.save"));
      toast({
        title: "Error",
        description: t("jobTitle.error.save"),
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
        <h1 className="text-primary-heading">{t("jobTitle.title")}</h1>
        <p className="text-gray-500 text-md">{t("jobTitle.subtitle")}</p>
      </div>

      <Button onClick={handleCreate} className="mb-4 mt-3 button-primary bg-white hover:bg-white">
        <Plus className="mr-2 h-4 w-4" /> {t("jobTitle.create")}
      </Button>

      <Table className="bg-white border border-gray-400">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">{t("jobTitle.table.title")}</TableHead>
            <TableHead className="font-semibold">{t("jobTitle.table.description")}</TableHead>
            <TableHead className="text-right font-semibold">
              {t("jobTitle.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobTitles.map((jobTitle) => (
            <TableRow key={jobTitle.jobTitleId}>
              <TableCell className="text-md">{jobTitle.title}</TableCell>
              <TableCell className="text-md">{jobTitle.description}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(jobTitle)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(jobTitle)}>
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
              {currentJobTitle ? t("jobTitle.dialog.edit") : t("jobTitle.dialog.create")}
            </DialogTitle>
          </DialogHeader>
          <JobTitleForm jobTitle={currentJobTitle} onSave={handleSave} />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary-md">
              {t("jobTitle.dialog.delete.confirm")}
            </DialogTitle>
            <DialogDescription>
              {t("jobTitle.dialog.delete.message")}{" "}
              <span className="font-bold text-black">{jobTitleToDelete?.title}</span>?{" "}
              {t("jobTitle.dialog.delete.warning")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="button-primary"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t("jobTitle.dialog.delete.cancel")}
            </Button>
            <Button
              className="button-red hover:bg-red"
              variant="destructive"
              onClick={handleDelete}
            >
              {t("jobTitle.dialog.delete.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function JobTitleForm({
  jobTitle,
  onSave,
}: {
  jobTitle: JobTitle | null;
  onSave: (jobTitle: JobTitle) => void;
}) {
  const { t } = useI18n();
  const [title, setTitle] = useState(jobTitle?.title || "");
  const [description, setDescription] = useState(jobTitle?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ jobTitleId: jobTitle?.jobTitleId || "", title, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">{t("jobTitle.dialog.label.title")}</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">{t("jobTitle.dialog.label.description")}</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <Button className="button-primary bg-white hover:bg-white" type="submit">
        {t("jobTitle.dialog.save")}
      </Button>
    </form>
  );
}
