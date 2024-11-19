CREATE INDEX ix_time ON vehicle_tracker_location (time DESC);

--> statement-breakpoint
CREATE INDEX ix_time_vehicle_tracker_id ON vehicle_tracker_location (vehicle_tracker_id, time DESC);

--> statement-breakpoint
SELECT
    create_hypertable('vehicle_tracker_location', 'time');