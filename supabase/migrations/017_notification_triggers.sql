-- Auto-create notification for admin when a new quote is submitted
CREATE OR REPLACE FUNCTION notify_admin_new_quote()
RETURNS TRIGGER AS $$
DECLARE
  admin_id UUID;
BEGIN
  -- Find admin user
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
  
  IF admin_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
      admin_id,
      'New Quote Request',
      'New quote from ' || NEW.name || ' (' || NEW.email || ')',
      'info'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_admin_new_quote ON quotes;
CREATE TRIGGER trigger_notify_admin_new_quote
  AFTER INSERT ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_quote();

-- Auto-create notification for admin when a contact form is submitted
CREATE OR REPLACE FUNCTION notify_admin_new_contact()
RETURNS TRIGGER AS $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
  
  IF admin_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
      admin_id,
      'New Contact Message',
      'Message from ' || NEW.name || ' (' || NEW.email || '): ' || LEFT(NEW.message, 100),
      'info'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_admin_new_contact ON contact_submissions;
CREATE TRIGGER trigger_notify_admin_new_contact
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_contact();

-- Notify client when their project status changes
CREATE OR REPLACE FUNCTION notify_client_project_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
      NEW.client_id,
      'Project Update',
      'Your project "' || NEW.name || '" status changed to ' || REPLACE(NEW.status, '_', ' '),
      'success'
    );
  END IF;
  
  IF OLD.progress IS DISTINCT FROM NEW.progress AND NEW.progress = 100 THEN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
      NEW.client_id,
      'Project Complete! 🎉',
      'Your project "' || NEW.name || '" is now 100% complete!',
      'success'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_client_project_update ON projects;
CREATE TRIGGER trigger_notify_client_project_update
  AFTER UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION notify_client_project_update();

-- Notify client when a new invoice is created
CREATE OR REPLACE FUNCTION notify_client_new_invoice()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (
    NEW.client_id,
    'New Invoice',
    'Invoice #' || NEW.invoice_number || ' for £' || NEW.amount || ' is now available.',
    'info'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_client_new_invoice ON invoices;
CREATE TRIGGER trigger_notify_client_new_invoice
  AFTER INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION notify_client_new_invoice();

-- Notify client when admin sends a message
CREATE OR REPLACE FUNCTION notify_client_new_message()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sender = 'admin' THEN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
      NEW.client_id,
      'New Message',
      'You have a new message from the Sites That Slap team.',
      'info'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_client_new_message ON messages;
CREATE TRIGGER trigger_notify_client_new_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_client_new_message();
