"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast"
import { api } from "../utils/api"
import { JobTitle, Team } from "./DataTable"

const formSchema = z.object({
    firstName: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    currentAddress: z.string().optional(),
    personalEmail: z.string().email({
        message: "Please enter a valid email address.",
    }),
    personalPhoneNumber: z.string().optional(),
    companyEmail: z.string().email({
        message: "Please enter a valid email address.",
    }),
    companyPhoneNumber: z.any().optional(),
    jobTitleId: z.any().optional(),
    teamId: z.any().optional(),
    dateOfBirth: z.any().optional(),
    birthPlace: z.any().optional(),
    gender: z.any().optional(),
    maritalStatus: z.any().optional(),
    employeeStatus: z.any().optional(),
})

interface UpdateEmployeeModalProps {
    employeeId: string;
    employeeUpdated: () => void;
    // isOpen: boolean;
}

export function UpdateEmployeeModal({ employeeId, employeeUpdated }: UpdateEmployeeModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            personalEmail: "",
            personalPhoneNumber: "",
            dateOfBirth: "",
            birthPlace: "",
            currentAddress: "",
            companyEmail: "",
            companyPhoneNumber: "",
            jobTitleId: "",
            teamId: "",
            gender: "",
            maritalStatus: "",
            employeeStatus: "",
        },
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobTitlesResponse, teamsResponse, employeeResponse] = await Promise.all([
                    api.get('/job-titles'),
                    api.get('/teams'),
                    api.get(`/employees/${employeeId}`)
                ]);

                if (!jobTitlesResponse.ok || !teamsResponse.ok || !employeeResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const jobTitlesData = await jobTitlesResponse.json();
                const teamsData = await teamsResponse.json();
                const employeeData = await employeeResponse.json();

                setJobTitles(jobTitlesData.data);
                setTeams(teamsData.data);
                form.reset(employeeData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast({
                    title: "Error",
                    description: "Failed to load job titles and teams. Please try again.",
                    variant: "destructive",
                })
            }
        };

        if (employeeId) {
            fetchData();
        }
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            const response = await api.put(`/employees/${employeeId}`, values);

            if (!response.ok) {
                throw new Error('Failed to create employee');
            }

            const data = await response.json();
            if (data.success) {
                setIsOpen(false)
                toast({
                    title: "Employee Updated",
                    description: "The employee has been successfully updated to the system.",
                })
                form.reset();
                employeeUpdated();
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            toast({
                title: "Error",
                description: "Failed to update employee. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="button-primary">Update</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-primary-md">Update Employee</DialogTitle>
                    <DialogDescription>
                        Fill in the details to update employee to the system.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="personalEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">Personal Email</FormLabel>
                                        <FormControl>
                                            <Input type="personalEmail" placeholder="john.doe@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="personalPhoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">Personal Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="012321313213" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">Birth Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="birthPlace"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Birth Place</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Birth place" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="currentAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Address</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Da Nang" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="MALE">Male</SelectItem>
                                                <SelectItem value="FEMALE">Female</SelectItem>
                                                <SelectItem value="OTHERS">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="maritalStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marital Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a marital status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="MARRIED">Married</SelectItem>
                                                <SelectItem value="NOT_MARRIED">Not Married</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="employeeStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employee Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an employee status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="OFFICIAL">Official</SelectItem>
                                                <SelectItem value="PROBATION">Probation</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="jobTitleId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Title</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a job title" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {jobTitles.map(job => (
                                                    <SelectItem key={job.jobTitleId} value={job.jobTitleId}>{job.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="teamId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Team</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a team" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {teams.map(team => (
                                                    <SelectItem key={team.teamId} value={team.teamId}>{team.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="companyEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="companyPhoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="012321313213" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="button-primary">{isSubmitting ? "Updating..." : "Update Employee"}</button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}