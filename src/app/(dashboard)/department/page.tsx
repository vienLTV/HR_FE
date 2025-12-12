'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from '@/app/utils/api'
import { useToast } from '@/hooks/use-toast'
import { Spinner } from '@/app/components/Spinner'

type Department = {
  departmentId: string;
  name: string;
  description: string;
  location: string;
  establishedDate: string;
  phoneNumber: string;
  email: string;
}

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null)
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/departments/')
      const data = await response.json()
      setDepartments(data.data)
      setError(null)
    } catch (err) {
      console.log(err);
      setError('Failed to fetch departments. Please try again later.')
      toast({
        title: "Error",
        description: "Failed to fetch departments. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setCurrentDepartment(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (department: Department) => {
    setCurrentDepartment(department)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (department: Department) => {
    setDepartmentToDelete(department)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!departmentToDelete) return

    try {
      await api.delete(`/departments/${departmentToDelete.departmentId}`)
      setDepartments(departments.filter(d => d.departmentId !== departmentToDelete.departmentId))
      setIsDeleteDialogOpen(false)
      setDepartmentToDelete(null)
      toast({
        title: "Success",
        description: `Department "${departmentToDelete.name}" has been deleted.`,
      })
    } catch (err) {
      console.log(err);
      setError('Failed to delete department. Please try again.')
      toast({
        title: "Error",
        description: "Failed to delete department. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSave = async (department: Department) => {
    try {
      if (currentDepartment) {
        await api.put(`/departments/${department.departmentId}`, department)
        setDepartments(departments.map(d => d.departmentId === department.departmentId ? department : d))
        toast({
          title: "Success",
          description: `Department "${department.name}" has been updated.`,
        })
      } else {
        const response = await api.post('/departments', department)
        const data = await response.json()
        setDepartments([...departments, data.data])
        toast({
          title: "Success",
          description: `New department "${department.name}" has been created.`,
        })
      }
      setIsDialogOpen(false)
    } catch (err) {
      console.log(err);
      setError('Failed to save department. Please try again.')
      toast({
        title: "Error",
        description: "Failed to save department. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    return <div className="w-full p-4 text-red-500">{error}</div>
  }

  return (
    <div className="w-full p-4">
      <div className="">
        <h1 className="text-primary-heading">Departments</h1>
        <p className="text-gray-500 text-md">Manage your organization departments</p>
      </div>

      <Button onClick={handleCreate} className="button-primary hover:bg-white mt-4">
        <Plus className="mr-2 h-4 w-4" /> Create Department
      </Button>

      <Table className='bg-white border border-gray-400 mt-5'>
        <TableHeader>
          <TableRow>
            <TableHead className='font-semibold'>Name</TableHead>
            <TableHead className='font-semibold'>Description</TableHead>
            <TableHead className='font-semibold'>Location</TableHead>
            <TableHead className='font-semibold'>Established Date</TableHead>
            <TableHead className='font-semibold'>Phone Number</TableHead>
            <TableHead className='font-semibold'>Email</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.departmentId}>
              <TableCell className="font-medium">{department.name}</TableCell>
              <TableCell>{department.description}</TableCell>
              <TableCell>{department.location}</TableCell>
              <TableCell>{department.establishedDate}</TableCell>
              <TableCell>{department.phoneNumber}</TableCell>
              <TableCell>{department.email}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(department)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(department)}>
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
            <DialogTitle className='text-primary-md'>{currentDepartment ? 'Edit Department' : 'Create Department'}</DialogTitle>
          </DialogHeader>
          <DepartmentForm department={currentDepartment} onSave={handleSave} />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-primary-md'>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the department <span className='font-bold text-black'>{departmentToDelete?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className='button-primary' variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button className='button-red' variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DepartmentForm({ department, onSave }: { department: Department | null, onSave: (department: Department) => void }) {
  const [name, setName] = useState(department?.name || '')
  const [description, setDescription] = useState(department?.description || '')
  const [location, setLocation] = useState(department?.location || '')
  const [establishedDate, setEstablishedDate] = useState(department?.establishedDate || '')
  const [phoneNumber, setPhoneNumber] = useState(department?.phoneNumber || '')
  const [email, setEmail] = useState(department?.email || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ 
      departmentId: department?.departmentId || '', 
      name, 
      description, 
      location, 
      establishedDate, 
      phoneNumber, 
      email 
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="establishedDate">Established Date</Label>
        <Input id="establishedDate" type="date" value={establishedDate} onChange={(e) => setEstablishedDate(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <Button className='button-primary' type="submit">Save</Button>
    </form>
  )
}