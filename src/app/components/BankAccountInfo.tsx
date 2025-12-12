"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { api } from "@/app/utils/api";
import { Spinner } from "@/app/components/Spinner";

interface BankAccount {
  bankAccountId: string;
  accountNumber: string;
  accountHolderName: string;
  bankName: string;
  issuedDate: string;
  expiredDate: string;
  expiryStatus: string;
  employeeId: string;
}

interface BankAccountInfoProps {
  employeeId: string;
}

export default function BankAccountInfo({ employeeId }: BankAccountInfoProps) {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<BankAccount | null>(
    null,
  );
  const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBankAccounts();
  }, [employeeId]);

  const fetchBankAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/bank-accounts/${employeeId}`);
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setBankAccounts(data.data);
        setError(null);
      } else {
        setError("No bank account data found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch bank accounts. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch bank accounts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentAccount(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (account: BankAccount) => {
    setCurrentAccount(account);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (account: BankAccount) => {
    setAccountToDelete(account);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!accountToDelete) return;

    try {
      await api.delete(`/bank-accounts/${accountToDelete.bankAccountId}`);
      setBankAccounts((accounts) =>
        accounts.filter(
          (a) => a.bankAccountId !== accountToDelete.bankAccountId,
        ),
      );
      setIsDeleteDialogOpen(false);
      setAccountToDelete(null);
      toast({
        title: "Success",
        description: `Bank account "${accountToDelete.accountNumber}" has been deleted.`,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to delete bank account. Please try again.");
      toast({
        title: "Error",
        description: "Failed to delete bank account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (account: BankAccount) => {
    try {
      if (currentAccount) {
        await api.put(`/bank-accounts/${account.bankAccountId}`, account);
        setBankAccounts((accounts) =>
          accounts.map((a) =>
            a.bankAccountId === account.bankAccountId ? account : a,
          ),
        );
        toast({
          title: "Success",
          description: `Bank account "${account.accountNumber}" has been updated.`,
        });
      } else {
        const response = await api.post("/bank-accounts", {
          ...account,
          employeeId,
        });
        const data = await response.json();
        setBankAccounts([...bankAccounts, data.data]);
        toast({
          title: "Success",
          description: `New bank account ${account.accountNumber} has been created.`,
        });
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save bank account. Please try again.");
      toast({
        title: "Error",
        description: "Failed to save bank account. Please try again.",
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
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Bank Accounts
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bankAccounts.map((account) => (
          <Card key={account.bankAccountId} className="mb-4">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label>Account Number</Label>
                  <p>{account.accountNumber || "N/A"}</p>
                </div>
                <div>
                  <Label>Account Holder Name</Label>
                  <p>{account.accountHolderName || "N/A"}</p>
                </div>
                <div>
                  <Label>Bank Name</Label>
                  <p>{account.bankName || "N/A"}</p>
                </div>
                <div>
                  <Label>Issued Date</Label>
                  <p>{account.issuedDate || "N/A"}</p>
                </div>
                <div>
                  <Label>Expired Date</Label>
                  <p>{account.expiredDate || "N/A"}</p>
                </div>
                <div>
                  <Label>Expiry Status</Label>
                  <p
                    className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      account.expiryStatus === "VALID"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {account.expiryStatus || "N/A"}
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button onClick={() => handleEdit(account)}>Edit</Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteClick(account)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentAccount ? "Edit Bank Account" : "Add Bank Account"}
            </DialogTitle>
          </DialogHeader>
          <BankAccountForm account={currentAccount} onSave={handleSave} />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the bank account{" "}
              <span className="font-semibold">
                {accountToDelete?.accountNumber}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function BankAccountForm({
  account,
  onSave,
}: {
  account: BankAccount | null;
  onSave: (account: BankAccount) => void;
}) {
  const [accountNumber, setAccountNumber] = useState(
    account?.accountNumber || "",
  );
  const [accountHolderName, setAccountHolderName] = useState(
    account?.accountHolderName || "",
  );
  const [bankName, setBankName] = useState(account?.bankName || "");
  const [issuedDate, setIssuedDate] = useState(account?.issuedDate || "");
  const [expiredDate, setExpiredDate] = useState(account?.expiredDate || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      bankAccountId: account?.bankAccountId || "",
      accountNumber,
      accountHolderName,
      bankName,
      issuedDate,
      expiredDate,
      expiryStatus: account?.expiryStatus || "VALID",
      employeeId: account?.employeeId || "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="accountHolderName">Account Holder Name</Label>
        <Input
          id="accountHolderName"
          value={accountHolderName}
          onChange={(e) => setAccountHolderName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="issuedDate">Issued Date</Label>
        <Input
          id="issuedDate"
          type="date"
          value={issuedDate}
          onChange={(e) => setIssuedDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="expiredDate">Expired Date</Label>
        <Input
          id="expiredDate"
          type="date"
          value={expiredDate}
          onChange={(e) => setExpiredDate(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
