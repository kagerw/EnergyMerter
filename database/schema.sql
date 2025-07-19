-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    timezone VARCHAR(50) DEFAULT 'Asia/Tokyo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Questions table
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    question_key VARCHAR(50) UNIQUE NOT NULL,
    question_text TEXT NOT NULL,
    icon_name VARCHAR(50),
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily records table
CREATE TABLE daily_records (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    wake_up_time TIME,
    bedtime TIME,
    notes TEXT,
    total_score INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, record_date)
);

-- Answers table
CREATE TABLE answers (
    id BIGSERIAL PRIMARY KEY,
    daily_record_id BIGINT NOT NULL REFERENCES daily_records(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer_value BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(daily_record_id, question_id)
);

-- Insert initial questions
INSERT INTO questions (question_key, question_text, icon_name, display_order) VALUES
('reading', '本を読む気力はありますか？', 'Book', 1),
('english', '英語を勉強する気力はありますか？', 'Brain', 2),
('sns', 'SNSをやる気力はありますか？', 'Smartphone', 3),
('eating', 'ごはんを食べる気力はありますか？', 'UtensilsCrossed', 4),
('bath', 'お風呂に入る気力はありますか？', 'Bath', 5),
('outside', '外に出る（or 窓を開ける）気力はありますか？', 'CloudSun', 6),
('talking', '人と話す（LINE・電話など）気力はありますか？', 'MessageCircle', 7),
('diary', '日記・記録をつける気力はありますか？', 'PenTool', 8),
('hobby', '好きなこと（ゲーム・創作など）をする気力はありますか？', 'Gamepad2', 9);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own records" ON daily_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own answers" ON answers FOR ALL USING (
    auth.uid() = (SELECT user_id FROM daily_records WHERE id = daily_record_id)
);

-- Questions are readable by all authenticated users
CREATE POLICY "Questions are readable by authenticated users" ON questions FOR SELECT TO authenticated USING (true);

-- Create indexes for performance
CREATE INDEX idx_daily_records_user_date ON daily_records(user_id, record_date);
CREATE INDEX idx_answers_daily_record ON answers(daily_record_id);
CREATE INDEX idx_questions_order ON questions(display_order) WHERE is_active = true;