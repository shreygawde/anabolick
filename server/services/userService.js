const supabase = require("../supabaseClient");

async function getUser() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .limit(1)
    .single();

  if (error) throw error;

  return data;
}

module.exports = { getUser };