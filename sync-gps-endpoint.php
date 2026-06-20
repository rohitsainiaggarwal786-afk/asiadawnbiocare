<?php
/* =========================================================================
   GPS ENDPOINT — sync.php me add karne ke liye
   Background app yahan ek-ek location POST karega: sync.php?action=gps
   Ye live locations ko ek alag file me merge karke rakhta hai.
   ISKO apni sync.php ke andar, jahan baaki "action" handle hote hain,
   waise hi top par paste kar do (DB use karte ho to neeche note dekho).
   ========================================================================= */

// --- secret check (jo aapki sync.php pehle se karti hai, wahi key) ---
$SECRET = 'AsiaDawn@2024!';
$hdr = isset($_SERVER['HTTP_X_CRM_SECRET']) ? $_SERVER['HTTP_X_CRM_SECRET'] : '';
if ($hdr !== $SECRET) { http_response_code(401); echo json_encode(['ok'=>false,'error'=>'bad secret']); exit; }

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'gps') {
    header('Content-Type: application/json');
    $raw = file_get_contents('php://input');
    $loc = json_decode($raw, true);
    if (!$loc || !isset($loc['name'])) { echo json_encode(['ok'=>false,'error'=>'no data']); exit; }

    $file = __DIR__ . '/live_locations.json';
    $all = [];
    if (file_exists($file)) { $all = json_decode(file_get_contents($file), true) ?: []; }
    $all[$loc['name']] = $loc;                 // har user ki latest location
    file_put_contents($file, json_encode($all), LOCK_EX);
    echo json_encode(['ok'=>true]);
    exit;
}

// Admin/Manager panel ke liye saari live locations padho: sync.php?action=gps_all
if ($action === 'gps_all') {
    header('Content-Type: application/json');
    $file = __DIR__ . '/live_locations.json';
    $all = file_exists($file) ? (json_decode(file_get_contents($file), true) ?: []) : [];
    echo json_encode(['ok'=>true, 'locations'=>$all]);
    exit;
}

/* =========================================================================
   NOTE — agar aap MySQL use karte ho (file ke bajaye):
   ek table bana lo:  live_locations(name PK, role, lat, lng, accuracy, device, ts)
   aur upar file_put_contents ki jagah ek INSERT ... ON DUPLICATE KEY UPDATE
   query laga do. Baaki logic same rahega.
   ========================================================================= */
