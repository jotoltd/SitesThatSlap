-- Fix trigger functions to use SECURITY DEFINER so they bypass RLS
CREATE OR REPLACE FUNCTION notify_admin_new_quote()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_id UUID;
BEGIN
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

CREATE OR REPLACE FUNCTION notify_admin_new_contact()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
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

CREATE OR REPLACE FUNCTION notify_client_project_update()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
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
      'Project Complete!',
      'Your project "' || NEW.name || '" is now 100% complete!',
      'success'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_client_new_invoice()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
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

CREATE OR REPLACE FUNCTION notify_client_new_message()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
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
