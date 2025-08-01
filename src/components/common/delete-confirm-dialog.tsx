'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  resourceName: string;
  onConfirm: () => void;
  isPending: boolean;
}

export const DeleteConfirmDialog = ({
  isOpen,
  setIsOpen,
  resourceName,
  onConfirm,
  isPending,
}: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>您确定要删除吗？</AlertDialogTitle>
          <AlertDialogDescription>
            此操作无法撤销。这将永久删除 “<strong>{resourceName}</strong>”。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>取消</AlertDialogCancel>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? '删除中...' : '确认删除'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
