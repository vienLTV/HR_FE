"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/app/utils/api";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  employeeEmail: string;
  employeeName: string;
  onAccountCreated: () => void;
}

export default function CreateAccountModal({
  isOpen,
  onClose,
  employeeId,
  employeeEmail,
  employeeName,
  onAccountCreated,
}: CreateAccountModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [passwordError, setPasswordError] = useState("");

  const handleCreateAccount = async () => {
    // Validation
    setPasswordError("");

    if (!password || !confirmPassword) {
      setPasswordError("Please fill in all password fields");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/create-employee-account", {
        employeeId,
        accountEmail: employeeEmail,
        password,
        role: role,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.detail || "Failed to create account");
      }

      toast({
        title: "Success",
        description: `Account created for ${employeeName}`,
      });

      // Reset form
      setPassword("");
      setConfirmPassword("");
      setRole("USER");
      setPasswordError("");

      // Close modal and refresh
      onAccountCreated();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create account";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create User Account</DialogTitle>
          <DialogDescription>Create a login account for {employeeName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee Email - Read Only */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={employeeEmail} readOnly className="bg-gray-50" />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole} disabled={isLoading}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {passwordError && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{passwordError}</div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleCreateAccount} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
