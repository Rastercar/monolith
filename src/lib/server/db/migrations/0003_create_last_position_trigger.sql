ALTER TABLE
    vehicle_tracker_last_location
SET
    (fillfactor = 95);

--> statement-breakpoint
CREATE OR REPLACE FUNCTION create_last_pos_trigger_fn() RETURNS TRIGGER LANGUAGE PLPGSQL AS
    $BODY$
        BEGIN
            INSERT INTO vehicle_tracker_last_location (vehicle_tracker_id, point, time) VALUES (NEW.vehicle_tracker_id, NEW.point, NEW.time) 
            ON CONFLICT (vehicle_tracker_id) DO UPDATE SET 
            point=NEW.point,
            time=new.time;
            RETURN NEW;
        END
    $BODY$;

--> statement-breakpoint
CREATE TRIGGER create_last_position_trigger BEFORE
INSERT
    OR
UPDATE
    ON vehicle_tracker_location FOR EACH ROW EXECUTE PROCEDURE create_last_pos_trigger_fn();