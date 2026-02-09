-- Project Enhancements: Favorites and Appointments
-- SQL statements to add new functionality to CSE Motors

-- =============================================
-- FAVORITES/WISHLIST TABLE
-- =============================================
-- Create favorites table to store user's saved vehicles
CREATE TABLE IF NOT EXISTS public.favorites (
    favorite_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    inv_id INT NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_favorites_account FOREIGN KEY (account_id) 
        REFERENCES public.account(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_inventory FOREIGN KEY (inv_id) 
        REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
    CONSTRAINT unique_favorite UNIQUE (account_id, inv_id)
);

-- Create index for faster queries
CREATE INDEX idx_favorites_account ON public.favorites(account_id);
CREATE INDEX idx_favorites_inv ON public.favorites(inv_id);

-- =============================================
-- APPOINTMENTS TABLE
-- =============================================
-- Create appointments table for test drive scheduling
CREATE TABLE IF NOT EXISTS public.appointments (
    appointment_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    inv_id INT NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    appointment_time VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointments_account FOREIGN KEY (account_id) 
        REFERENCES public.account(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_inventory FOREIGN KEY (inv_id) 
        REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
    CONSTRAINT chk_status CHECK (status IN ('scheduled', 'completed', 'cancelled'))
);

-- Create indexes for faster queries
CREATE INDEX idx_appointments_account ON public.appointments(account_id);
CREATE INDEX idx_appointments_inv ON public.appointments(inv_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);

-- =============================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- =============================================
-- Uncomment to add sample favorites (replace account_id and inv_id with actual values)
-- INSERT INTO public.favorites (account_id, inv_id) VALUES (1, 1);
-- INSERT INTO public.favorites (account_id, inv_id) VALUES (1, 2);

-- Uncomment to add sample appointments (replace with actual values)
-- INSERT INTO public.appointments (account_id, inv_id, appointment_date, appointment_time, notes) 
-- VALUES (1, 1, '2026-02-15', '10:00 AM', 'First test drive appointment');
