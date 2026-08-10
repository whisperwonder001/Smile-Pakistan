-- Branches
INSERT INTO branches (id, name, city, address, hours) VALUES
('lahore-gulberg', 'Gulberg III', 'Lahore', '12-C, Main Boulevard, Gulberg III, Lahore', 'Mon–Sat, 10:00 AM – 9:00 PM'),
('karachi-clifton', 'Clifton', 'Karachi', 'Block 5, Clifton, Karachi', 'Mon–Sat, 10:00 AM – 9:00 PM'),
('islamabad-f7', 'F-7 Markaz', 'Islamabad', 'F-7 Markaz, Islamabad', 'Mon–Sat, 10:00 AM – 8:00 PM');

-- Treatments (subset mirroring lib/services-data.ts, enough to prove the model)
INSERT INTO treatments (id, slug, title, category, "shortDesc", "priceFrom", "priceTo", "durationLabel") VALUES
('t-fillings', 'dental-fillings', 'Dental Fillings', 'Restorative', 'Tooth-coloured composite fillings that restore cavities in a single visit.', 3000, 8000, '30–45 minutes'),
('t-whitening', 'teeth-whitening', 'Teeth Whitening', 'Cosmetic', 'Clinically supervised whitening for a brighter, natural-looking smile.', 15000, 35000, '45–60 minutes'),
('t-implants', 'dental-implants', 'Dental Implants', 'Surgical & Preventive', 'Titanium tooth-root replacements that restore full bite strength.', 80000, 180000, '3–6 months, across multiple stages'),
('t-scaling', 'scaling-polishing', 'Scaling & Polishing', 'Surgical & Preventive', 'Professional cleaning to remove plaque, tartar, and surface stains.', 3000, 7000, '30–45 minutes'),
('t-xray', 'digital-x-rays', 'Digital X-rays', 'Family & Diagnostics', 'Low-radiation digital imaging used to diagnose every treatment plan.', 1500, 5000, '5–10 minutes');

-- Doctor users
INSERT INTO users (id, email, "passwordHash", "fullName", phone, role, "updatedAt") VALUES
('u-doc-ahsan', 'ahsan.malik@smilepakistan.pk', '$2b$10$T8vnqutJMzDlmsYw6pkxWOgMkAdJva6W5Ah/F7E3rWkVzDXlBzig2', 'Dr. Ahsan Malik', '03211234567', 'DOCTOR', now()),
('u-doc-sana', 'sana.qureshi@smilepakistan.pk', '$2b$10$T8vnqutJMzDlmsYw6pkxWOgMkAdJva6W5Ah/F7E3rWkVzDXlBzig2', 'Dr. Sana Qureshi', '03211234568', 'DOCTOR', now());

INSERT INTO doctors (id, "userId", specialty, "updatedAt") VALUES
('doc-ahsan', 'u-doc-ahsan', 'Prosthodontist & Implantologist', now()),
('doc-sana', 'u-doc-sana', 'Orthodontist', now());

INSERT INTO doctor_branches ("doctorId", "branchId") VALUES
('doc-ahsan', 'lahore-gulberg'),
('doc-ahsan', 'islamabad-f7'),
('doc-sana', 'lahore-gulberg'),
('doc-sana', 'karachi-clifton');

-- Demo patient
INSERT INTO users (id, email, "passwordHash", "fullName", phone, role, "updatedAt") VALUES
('u-patient-ayesha', 'ayesha.khan@example.com', '$2b$10$T8vnqutJMzDlmsYw6pkxWOgMkAdJva6W5Ah/F7E3rWkVzDXlBzig2', 'Ayesha Khan', '03012345678', 'PATIENT', now());

INSERT INTO patients (id, "userId", "branchId", "updatedAt") VALUES
('pat-ayesha', 'u-patient-ayesha', 'lahore-gulberg', now());

-- Appointments
INSERT INTO appointments (id, "patientId", "doctorId", "branchId", "treatmentId", "startsAt", status, "updatedAt") VALUES
('apt-1', 'pat-ayesha', 'doc-sana', 'lahore-gulberg', 't-scaling', '2026-08-14 17:00:00', 'CONFIRMED', now()),
('apt-2', 'pat-ayesha', 'doc-sana', 'lahore-gulberg', 't-whitening', '2026-05-02 15:30:00', 'COMPLETED', now()),
('apt-3', 'pat-ayesha', 'doc-ahsan', 'lahore-gulberg', 't-xray', '2026-04-18 11:00:00', 'COMPLETED', now());

-- Clinical notes (treatment history)
INSERT INTO clinical_notes (id, "appointmentId", "doctorId", note) VALUES
('cn-1', 'apt-2', 'doc-sana', 'In-office whitening, shade improved from A3 to A1. Advised avoiding staining foods for 48 hours.'),
('cn-2', 'apt-3', 'doc-ahsan', 'Routine check-up. Minor plaque buildup noted, scaling recommended.');

-- Invoices + payments
INSERT INTO invoices (id, "patientId", "appointmentId", "branchId", amount, status, description) VALUES
('inv-1', 'pat-ayesha', 'apt-1', 'lahore-gulberg', 5000, 'UNPAID', 'Scaling & Polishing'),
('inv-2', 'pat-ayesha', 'apt-2', 'lahore-gulberg', 22000, 'PAID', 'Teeth Whitening');

INSERT INTO payments (id, "invoiceId", amount, method) VALUES
('pay-1', 'inv-2', 22000, 'CARD');

-- Documents
INSERT INTO documents (id, "patientId", "fileUrl", name, type) VALUES
('doc-1', 'pat-ayesha', 'https://example.com/reports/whitening-aftercare.pdf', 'Whitening aftercare instructions', 'Report');

INSERT INTO xrays (id, "patientId", "fileUrl", label) VALUES
('xr-1', 'pat-ayesha', 'https://example.com/xrays/panoramic-apr-2026.jpg', 'Panoramic X-ray — Apr 2026');
