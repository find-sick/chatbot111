import { createClient } from '@supabase/supabase-js';

// 服务端使用 service_role 密钥（高权限，仅在服务端使用）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);