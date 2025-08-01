'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PurgeTenantConfirmDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tenantName: string;
  onConfirm: () => void;
  isPending: boolean;
}

export const PurgeTenantConfirmDialog = ({
  isOpen,
  setIsOpen,
  tenantName,
  onConfirm,
  isPending,
}: PurgeTenantConfirmDialogProps) => {
  const [confirmationText, setConfirmationText] = useState('');

  // 确认按钮只有在输入框内容与租户名完全一致时才可用
  const isConfirmDisabled = confirmationText !== tenantName;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">确认彻底清除租户？</AlertDialogTitle>
          <AlertDialogDescription>
            这是一个不可逆的操作！将永久删除租户 “<strong>{tenantName}</strong>”
            及其下的**所有**用户、角色、课程数据和日志。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="pt-2">
          <Label htmlFor="confirm-tenant-name"> 为防止误操作，请输入租户名称以确认：</Label>
          <Input
            id="confirm-tenant-name"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="mt-2"
            placeholder={tenantName}
            autoFocus
          />
        </div>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
            取消
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isConfirmDisabled || isPending}>
            {isPending ? '正在清除...' : '我已了解风险，确认清除'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
