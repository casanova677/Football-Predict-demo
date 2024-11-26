CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,        -- Auto-incrementing ID
    fixture_id INTEGER NOT NULL,  -- Fixture ID to link with a match
    predicted_score VARCHAR(10),  -- Example format: "2:1"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the prediction was made
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_fixture FOREIGN KEY (fixture_id) REFERENCES fixtures (id) ON DELETE CASCADE
);
