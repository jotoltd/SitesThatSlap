-- Allow clients to update (mark as read) their own messages
CREATE POLICY "Clients can update own messages"
  ON public.messages FOR UPDATE
  USING (client_id = auth.uid());

-- Allow admins to delete their own notifications
CREATE POLICY "Admins can delete own notifications"
  ON notifications FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
