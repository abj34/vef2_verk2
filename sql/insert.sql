INSERT INTO events (id, name, slug, description, location, url, owner) VALUES (1, 'Forritarahittingur í febrúar', 'forritarahittingur-i-februar', 'Forritarar hittast í febrúar og forrita saman eitthvað frábært.', 'Háskólatorg', 'www.hi.is', 0);
INSERT INTO events (id, name, slug, description, location, url, owner) VALUES (2, 'Hönnuðahittingur í mars', 'honnudahittingur-i-mars', 'Spennandi hittingur hönnuða í Hönnunarmars.','','www.rugl.is', 0);
INSERT INTO events (id, name, slug, description, location, url, owner) VALUES (3, 'Verkefnastjórahittingur í apríl', 'verkefnastjorahittingur-i-april', 'Virkilega vel verkefnastýrður hittingur.','TBA','www.bull.is', 1);

INSERT INTO registrations (name, comment, event) VALUES ('Forvitinn forritari', 'Hlakka til að forrita með ykkur', 1);
INSERT INTO registrations (name, comment, event) VALUES ('Jón Jónsson', null, 1);
INSERT INTO registrations (name, comment, event) VALUES ('Guðrún Guðrúnar', 'verður vefforritað?', 1);

INSERT INTO users (name, username, password, isAdmin) VALUES ('Admin Bragi', 'admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', true);
