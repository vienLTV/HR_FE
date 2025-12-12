import { useState } from "react";
import { api } from "../utils/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "./Spinner";

interface AvatarUploadProps {
    employeeId: string;
    onAvatarUpdate: () => void
}
const AvatarUploadDialog = ({ employeeId, onAvatarUpdate }: AvatarUploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        try {
            // Read the file as a base64 string
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64String = reader.result as string;

                // Prepare the JSON payload
                const payload = {
                    employeeId: employeeId,
                    avatarImage: base64String.split(',')[1], // Remove the "data:image/png;base64," part
                    avatarFileName: file.name,
                    avatarContentType: file.type,
                    avatarFileSize: file.size
                };

                const response = await api.post('/employees/profile', payload);

                if (response.ok) {
                    onAvatarUpdate();
                } else {
                    throw new Error('Failed to upload avatar');
                }
            };
        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setIsUploading(false);
        };
    }

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <button className="button-primary">Change Avatar</button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-primary-md">Change Avatar</DialogTitle>
                        <DialogDescription>
                            Upload a new avatar image here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid w-full items-center gap-4">
                            <Input
                                id="avatar"
                                type="file"
                                className="col-span-3 border-secondary"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>
                    </div>
                    <button onClick={handleUpload} disabled={!file || isUploading}className="button-primary">{isUploading ? <Spinner /> : 'Upload Avatar'}</button>
                </DialogContent>
            </Dialog>
        )
    }

    export default AvatarUploadDialog;