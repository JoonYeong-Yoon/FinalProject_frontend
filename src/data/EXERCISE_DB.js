import { MUSCLE_INDEXES } from "./MUSCLE_INDEXES";

// 자동 tertiary 추가
function autoTertiary(ex) {
  let t = [];

  if (ex.tags.includes("push"))
    t.push("abs_upper_1", "abs_mid_1", "abs_lower");

  if (ex.tags.includes("pull"))
    t.push("bicep_brachialis", "brachialis");

  if (ex.tags.includes("lower"))
    t.push("erector_spinae", "glute_middle");

  if (ex.tags.includes("core"))
    t.push("hip_flexor");

  ex.tertiary = [...new Set([...(ex.tertiary || []), ...t])];
  return ex;
}

// =======================================================================
//  📌 1) 가슴 Chest
// =======================================================================
export const EXERCISE_DB = {
  // --------------------
  upper_chest: [
    autoTertiary({ name:"인클라인 푸시업", primary:["upper_chest"], secondary:["front_delts"], tags:["push"] }),
    autoTertiary({ name:"발 올린 푸시업", primary:["upper_chest"], secondary:["front_delts"], tags:["push"] }),
    autoTertiary({ name:"아처 푸시업", primary:["upper_chest"], secondary:["middle_chest"], tags:["push"] }),
    autoTertiary({ name:"와이드 푸시업", primary:["upper_chest"], secondary:["middle_chest"], tags:["push"] }),
  ],

  middle_chest: [
    autoTertiary({ name:"기본 푸시업", primary:["middle_chest"], secondary:["front_delts"], tags:["push"] }),
    autoTertiary({ name:"슬로우 푸시업", primary:["middle_chest"], secondary:["triceps_long"], tags:["push"] }),
    autoTertiary({ name:"스핑크스 푸시업", primary:["middle_chest"], secondary:["triceps_long"], tags:["push"] }),
    autoTertiary({ name:"박스 푸시업", primary:["middle_chest"], secondary:["upper_chest"], tags:["push"] }),
  ],

  lower_chest: [
    autoTertiary({ name:"디클라인 푸시업", primary:["lower_chest"], secondary:["front_delts"], tags:["push"] }),
    autoTertiary({ name:"딥스(맨몸)", primary:["lower_chest"], secondary:["front_delts"], tags:["push"] }),
    autoTertiary({ name:"슬라이딩 푸시업", primary:["lower_chest"], secondary:["middle_chest"], tags:["push"] }),
    autoTertiary({ name:"니 푸시업", primary:["lower_chest"], secondary:["triceps_long"], tags:["push"] }),
  ],

  // =======================================================================
  //  📌 2) 어깨 Shoulders
  // =======================================================================

  front_delts: [
    autoTertiary({ name:"파이크 푸시업", primary:["front_delts"], secondary:["side_delts"], tags:["push"] }),
    autoTertiary({ name:"핸드스탠드 푸시업", primary:["front_delts"], secondary:["traps_upper"], tags:["push"] }),
    autoTertiary({ name:"숄더 탭", primary:["front_delts"], secondary:["core"], tags:["push"] }),
    autoTertiary({ name:"인버티드 프레스", primary:["front_delts"], secondary:["triceps_long"], tags:["push"] }),
  ],

  side_delts: [
    autoTertiary({ name:"사이드 레이즈(맨몸)", primary:["side_delts"], secondary:["front_delts"], tags:["push"] }),
    autoTertiary({ name:"벽 레터럴 레이즈", primary:["side_delts"], secondary:["front_delts"], tags:["push"] }),
    autoTertiary({ name:"팔 벌리기 홀드", primary:["side_delts"], secondary:["rear_delts"], tags:["push"] }),
    autoTertiary({ name:"체스트 오픈", primary:["side_delts"], secondary:["rear_delts"], tags:["push"] }),
  ],

  rear_delts: [
    autoTertiary({ name:"리버스 플라이(맨몸)", primary:["rear_delts"], secondary:["mid_back"], tags:["pull"] }),
    autoTertiary({ name:"Y-Raise", primary:["rear_delts"], secondary:["traps_upper"], tags:["pull"] }),
    autoTertiary({ name:"T-Raise", primary:["rear_delts"], secondary:["traps_middle"], tags:["pull"] }),
    autoTertiary({ name:"A-Raise", primary:["rear_delts"], secondary:["lat_upper_1"], tags:["pull"] }),
  ],

  // =======================================================================
  //  📌 3) 등 BACK — 9개 세부근육
  // =======================================================================

  traps_upper: [
    autoTertiary({ name:"슈러그(맨몸)", primary:["traps_upper"], secondary:["traps_middle"], tags:["pull"] }),
    autoTertiary({ name:"데드행", primary:["traps_upper"], secondary:["lat_upper_1"], tags:["pull"] }),
    autoTertiary({ name:"Y-Raise", primary:["traps_upper"], secondary:["rear_delts"], tags:["pull"] }),
    autoTertiary({ name:"스캡션", primary:["traps_upper"], secondary:["rear_delts"], tags:["pull"] }),
  ],

  traps_middle: [
    autoTertiary({ name:"리버스 플라이(바닥)", primary:["traps_middle"], secondary:["rear_delts"], tags:["pull"] }),
    autoTertiary({ name:"T-Raise", primary:["traps_middle"], secondary:["mid_back"], tags:["pull"] }),
    autoTertiary({ name:"스케어캡 리트랙션", primary:["traps_middle"], secondary:["mid_back"], tags:["pull"] }),
    autoTertiary({ name:"맨몸 로우", primary:["traps_middle"], secondary:["rear_delts"], tags:["pull"] }),
  ],

  traps_lower: [
    autoTertiary({ name:"슈퍼맨", primary:["traps_lower"], secondary:["erector_spinae"], tags:["pull"] }),
    autoTertiary({ name:"백 익스텐션(맨몸)", primary:["traps_lower"], secondary:["mid_back"], tags:["pull"] }),
    autoTertiary({ name:"A-Raise", primary:["traps_lower"], secondary:["rear_delts"], tags:["pull"] }),
    autoTertiary({ name:"Y-Raise", primary:["traps_lower"], secondary:["lat_middle"], tags:["pull"] }),
  ],

  lat_upper_1: [
    autoTertiary({ name:"풀업(광배 상부1)", primary:["lat_upper_1"], secondary:["rear_delts"], tags:["pull"] }),
    autoTertiary({ name:"친업", primary:["lat_upper_1"], secondary:["bicep_brachialis"], tags:["pull"] }),
    autoTertiary({ name:"인버티드 로우", primary:["lat_upper_1"], secondary:["mid_back"], tags:["pull"] }),
    autoTertiary({ name:"암홀드 행", primary:["lat_upper_1"], secondary:["traps_upper"], tags:["pull"] }),
  ],

  lat_upper_2: [
    autoTertiary({ name:"풀업(혼합그립)", primary:["lat_upper_2"], secondary:["rear_delts"], tags:["pull"] }),
    autoTertiary({ name:"체스트 투 바", primary:["lat_upper_2"], secondary:["lat_upper_1"], tags:["pull"] }),
    autoTertiary({ name:"와이드풀업", primary:["lat_upper_2"], secondary:["lat_middle"], tags:["pull"] }),
    autoTertiary({ name:"스캡 풀업", primary:["lat_upper_2"], secondary:["traps_middle"], tags:["pull"] }),
  ],

  lat_middle: [
    autoTertiary({ name:"인버티드 로우(중립)", primary:["lat_middle"], secondary:["mid_back"], tags:["pull"] }),
    autoTertiary({ name:"페이스풀", primary:["lat_middle"], secondary:["rear_delts"], tags:["pull"] }),
    autoTertiary({ name:"스케어캡 리트랙션", primary:["lat_middle"], secondary:["traps_middle"], tags:["pull"] }),
    autoTertiary({ name:"스윙 풀 다운(맨몸)", primary:["lat_middle"], secondary:["lat_lower"], tags:["pull"] }),
  ],

  lat_lower: [
    autoTertiary({ name:"데드행", primary:["lat_lower"], secondary:["traps_lower"], tags:["pull"] }),
    autoTertiary({ name:"풀다운 모션(맨몸)", primary:["lat_lower"], secondary:["lat_middle"], tags:["pull"] }),
    autoTertiary({ name:"슈퍼맨 풀", primary:["lat_lower"], secondary:["erector_spinae"], tags:["pull"] }),
    autoTertiary({ name:"백익스텐션", primary:["lat_lower"], secondary:["mid_back"], tags:["pull"] }),
  ],

  mid_back: [
    autoTertiary({ name:"페이스풀", primary:["mid_back"], secondary:["rear_delts"], tags:["pull"] }),
    autoTertiary({ name:"리버스 플라이", primary:["mid_back"], secondary:["traps_middle"], tags:["pull"] }),
    autoTertiary({ name:"인버티드 로우", primary:["mid_back"], secondary:["lat_middle"], tags:["pull"] }),
    autoTertiary({ name:"시티드 로우 동작", primary:["mid_back"], secondary:["lat_lower"], tags:["pull"] }),
  ],

  erector_spinae: [
    autoTertiary({ name:"백 익스텐션", primary:["erector_spinae"], secondary:["mid_back"], tags:["pull"] }),
    autoTertiary({ name:"슈퍼맨", primary:["erector_spinae"], secondary:["traps_lower"], tags:["pull"] }),
    autoTertiary({ name:"버드독", primary:["erector_spinae"], secondary:["glute_middle"], tags:["pull"] }),
    autoTertiary({ name:"굿모닝(맨몸)", primary:["erector_spinae"], secondary:["hamstring_inner"], tags:["pull"] }),
  ],

  // =======================================================================
  //  📌 4) 팔 Arms
  // =======================================================================

  bicep_brachialis: [
    autoTertiary({ name:"친업", primary:["bicep_brachialis"], secondary:["lat_middle"], tags:["pull"] }),
    autoTertiary({ name:"인버티드 컬", primary:["bicep_brachialis"], secondary:["brachialis"], tags:["pull"] }),
    autoTertiary({ name:"암컬 홀드", primary:["bicep_brachialis"], secondary:["forearm_flexor"], tags:["pull"] }),
    autoTertiary({ name:"플레이트컬(맨몸)", primary:["bicep_brachialis"], secondary:["brachialis"], tags:["pull"] }),
  ],

  brachialis: [
    autoTertiary({ name:"해머컬 동작(맨몸)", primary:["brachialis"], secondary:["bicep_brachialis"], tags:["pull"] }),
    autoTertiary({ name:"친업(중립그립)", primary:["brachialis"], secondary:["lat_middle"], tags:["pull"] }),
    autoTertiary({ name:"인버티드 컬", primary:["brachialis"], secondary:["forearm_flexor"], tags:["pull"] }),
    autoTertiary({ name:"버티컬 컬", primary:["brachialis"], secondary:["forearm_brachioradialis"], tags:["pull"] }),
  ],

  forearm_brachioradialis: [
    autoTertiary({ name:"해머컬 모션", primary:["forearm_brachioradialis"], secondary:["bicep_brachialis"], tags:["pull"] }),
    autoTertiary({ name:"리버스 컬", primary:["forearm_brachioradialis"], secondary:["brachialis"], tags:["pull"] }),
    autoTertiary({ name:"그립 행잉", primary:["forearm_brachioradialis"], secondary:["lat_upper_2"], tags:["pull"] }),
    autoTertiary({ name:"전완 로테이션", primary:["forearm_brachioradialis"], secondary:["forearm_flexor"], tags:["pull"] }),
  ],

  forearm_flexor: [
    autoTertiary({ name:"손목 컬", primary:["forearm_flexor"], secondary:["forearm_brachioradialis"], tags:["pull"] }),
    autoTertiary({ name:"리버스 컬", primary:["forearm_flexor"], secondary:["brachialis"], tags:["pull"] }),
    autoTertiary({ name:"그립 버티기", primary:["forearm_flexor"], secondary:["traps_upper"], tags:["pull"] }),
    autoTertiary({ name:"전완 비틀기", primary:["forearm_flexor"], secondary:["bicep_brachialis"], tags:["pull"] }),
  ],

  triceps_long: [
    autoTertiary({ name:"트라이셉 익스텐션(맨몸)", primary:["triceps_long"], secondary:["triceps_lateral"], tags:["push"] }),
    autoTertiary({ name:"딥스", primary:["triceps_long"], secondary:["front_delts"], tags:["push"] }),
    autoTertiary({ name:"스핑크스 푸시업", primary:["triceps_long"], secondary:["middle_chest"], tags:["push"] }),
    autoTertiary({ name:"숄더 탭 푸시업", primary:["triceps_long"], secondary:["front_delts"], tags:["push"] }),
  ],

  triceps_lateral: [
    autoTertiary({ name:"딥스", primary:["triceps_lateral"], secondary:["front_delts"], tags:["push"] }),
    autoTertiary({ name:"클로즈 푸시업", primary:["triceps_lateral"], secondary:["triceps_long"], tags:["push"] }),
    autoTertiary({ name:"킥백 모션", primary:["triceps_lateral"], secondary:["triceps_medial"], tags:["push"] }),
    autoTertiary({ name:"머리 위 익스텐션", primary:["triceps_lateral"], secondary:["triceps_long"], tags:["push"] }),
  ],

  triceps_medial: [
    autoTertiary({ name:"트라이셉 푸시업", primary:["triceps_medial"], secondary:["middle_chest"], tags:["push"] }),
    autoTertiary({ name:"클로즈 푸시업", primary:["triceps_medial"], secondary:["upper_chest"], tags:["push"] }),
    autoTertiary({ name:"스핑크스 푸시업", primary:["triceps_medial"], secondary:["triceps_lateral"], tags:["push"] }),
    autoTertiary({ name:"딥스", primary:["triceps_medial"], secondary:["front_delts"], tags:["push"] }),
  ],

  // =======================================================================
  //  📌 5) 복근 Abs
  // =======================================================================

  abs_upper_1: [
    autoTertiary({ name:"크런치", primary:["abs_upper_1"], secondary:["abs_upper_2"], tags:["core"] }),
    autoTertiary({ name:"윗몸 말아올리기", primary:["abs_upper_1"], secondary:["abs_mid_1"], tags:["core"] }),
    autoTertiary({ name:"토터치", primary:["abs_upper_1"], secondary:["abs_lower"], tags:["core"] }),
    autoTertiary({ name:"플랭크 니업", primary:["abs_upper_1"], secondary:["abs_mid_2"], tags:["core"] }),
  ],

  abs_upper_2: [
    autoTertiary({ name:"크런치 변형", primary:["abs_upper_2"], secondary:["abs_upper_1"], tags:["core"] }),
    autoTertiary({ name:"V업", primary:["abs_upper_2"], secondary:["abs_lower"], tags:["core"] }),
    autoTertiary({ name:"싯업", primary:["abs_upper_2"], secondary:["abs_mid_1"], tags:["core"] }),
    autoTertiary({ name:"플랭크", primary:["abs_upper_2"], secondary:["erector_spinae"], tags:["core"] }),
  ],

  abs_mid_1: [
    autoTertiary({ name:"레그레이즈", primary:["abs_mid_1"], secondary:["abs_lower"], tags:["core"] }),
    autoTertiary({ name:"싯업", primary:["abs_mid_1"], secondary:["abs_upper_2"], tags:["core"] }),
    autoTertiary({ name:"플러터 킥", primary:["abs_mid_1"], secondary:["abs_lower"], tags:["core"] }),
    autoTertiary({ name:"버드독", primary:["abs_mid_1"], secondary:["erector_spinae"], tags:["core"] }),
  ],

  abs_mid_2: [
    autoTertiary({ name:"싯업", primary:["abs_mid_2"], secondary:["abs_upper_1"], tags:["core"] }),
    autoTertiary({ name:"레그레이즈", primary:["abs_mid_2"], secondary:["abs_mid_1"], tags:["core"] }),
    autoTertiary({ name:"록킹 홀드", primary:["abs_mid_2"], secondary:["abs_lower"], tags:["core"] }),
    autoTertiary({ name:"플랭크 변형", primary:["abs_mid_2"], secondary:["abs_upper_2"], tags:["core"] }),
  ],

  abs_lower: [
    autoTertiary({ name:"레그레이즈", primary:["abs_lower"], secondary:["abs_mid_1"], tags:["core"] }),
    autoTertiary({ name:"리버스 크런치", primary:["abs_lower"], secondary:["abs_mid_2"], tags:["core"] }),
    autoTertiary({ name:"행잉 레그레이즈", primary:["abs_lower"], secondary:["abs_upper_2"], tags:["core"] }),
    autoTertiary({ name:"니업", primary:["abs_lower"], secondary:["abs_mid_1"], tags:["core"] }),
  ],

  // =======================================================================
  //  📌 6) 엉덩이 Glutes
  // =======================================================================

  glute_outer: [
    autoTertiary({ name:"힙어브덕션", primary:["glute_outer"], secondary:["glute_middle"], tags:["lower"] }),
    autoTertiary({ name:"사이드 런지", primary:["glute_outer"], secondary:["thigh_outer"], tags:["lower"] }),
    autoTertiary({ name:"백킥", primary:["glute_outer"], secondary:["hamstring_outer"], tags:["lower"] }),
    autoTertiary({ name:"몽키 킥", primary:["glute_outer"], secondary:["hamstring_inner"], tags:["lower"] }),
  ],

  glute_middle: [
    autoTertiary({ name:"힙힌지", primary:["glute_middle"], secondary:["erector_spinae"], tags:["lower"] }),
    autoTertiary({ name:"브릿지", primary:["glute_middle"], secondary:["hamstring_inner"], tags:["lower"] }),
    autoTertiary({ name:"백익스텐션", primary:["glute_middle"], secondary:["hamstring_outer"], tags:["lower"] }),
    autoTertiary({ name:"스쿼트", primary:["glute_middle"], secondary:["thigh_middle"], tags:["lower"] }),
  ],

  glute_center: [
    autoTertiary({ name:"힙 스러스트(맨몸)", primary:["glute_center"], secondary:["glute_middle"], tags:["lower"] }),
    autoTertiary({ name:"도그포즈 킥", primary:["glute_center"], secondary:["hamstring_inner"], tags:["lower"] }),
    autoTertiary({ name:"힙익스텐션", primary:["glute_center"], secondary:["erector_spinae"], tags:["lower"] }),
    autoTertiary({ name:"와이드 스쿼트", primary:["glute_center"], secondary:["thigh_inner"], tags:["lower"] }),
  ],

  // =======================================================================
  //  📌 7) 허벅지 Thighs
  // =======================================================================

  thigh_upper: [
    autoTertiary({ name:"스쿼트", primary:["thigh_upper"], secondary:["glute_middle"], tags:["lower"] }),
    autoTertiary({ name:"점프 스쿼트", primary:["thigh_upper"], secondary:["thigh_middle"], tags:["lower"] }),
    autoTertiary({ name:"런지", primary:["thigh_upper"], secondary:["glute_middle"], tags:["lower"] }),
    autoTertiary({ name:"월싯", primary:["thigh_upper"], secondary:["thigh_middle"], tags:["lower"] }),
  ],

  thigh_outer: [
    autoTertiary({ name:"사이드런지", primary:["thigh_outer"], secondary:["glute_outer"], tags:["lower"] }),
    autoTertiary({ name:"와이드 스쿼트", primary:["thigh_outer"], secondary:["glute_center"], tags:["lower"] }),
    autoTertiary({ name:"사이드 킥", primary:["thigh_outer"], secondary:["glute_outer"], tags:["lower"] }),
    autoTertiary({ name:"점프 런지", primary:["thigh_outer"], secondary:["glute_middle"], tags:["lower"] }),
  ],

  thigh_middle: [
    autoTertiary({ name:"스쿼트", primary:["thigh_middle"], secondary:["glute_middle"], tags:["lower"] }),
    autoTertiary({ name:"런지", primary:["thigh_middle"], secondary:["glute_outer"], tags:["lower"] }),
    autoTertiary({ name:"점프 스쿼트", primary:["thigh_middle"], secondary:["thigh_upper"], tags:["lower"] }),
    autoTertiary({ name:"버피", primary:["thigh_middle"], secondary:["thigh_lower"], tags:["lower"] }),
  ],

  thigh_lower: [
    autoTertiary({ name:"스플릿 스쿼트", primary:["thigh_lower"], secondary:["glute_middle"], tags:["lower"] }),
    autoTertiary({ name:"점프 킥", primary:["thigh_lower"], secondary:["thigh_outer"], tags:["lower"] }),
    autoTertiary({ name:"사이드 방어 스텝", primary:["thigh_lower"], secondary:["thigh_inner"], tags:["lower"] }),
    autoTertiary({ name:"런지 니업", primary:["thigh_lower"], secondary:["thigh_middle"], tags:["lower"] }),
  ],

  thigh_inner: [
    autoTertiary({ name:"와이드 스쿼트", primary:["thigh_inner"], secondary:["glute_center"], tags:["lower"] }),
    autoTertiary({ name:"사이드 런지", primary:["thigh_inner"], secondary:["glute_outer"], tags:["lower"] }),
    autoTertiary({ name:"힙어브덕션", primary:["thigh_inner"], secondary:["glute_middle"], tags:["lower"] }),
    autoTertiary({ name:"내전근 스쿼트", primary:["thigh_inner"], secondary:["thigh_middle"], tags:["lower"] }),
  ],

  // =======================================================================
  //  📌 8) 뒷벅지 Hamstrings
  // =======================================================================

  hamstring_outer: [
    autoTertiary({ name:"힙힌지", primary:["hamstring_outer"], secondary:["hamstring_inner"], tags:["lower"] }),
    autoTertiary({ name:"백익스텐션", primary:["hamstring_outer"], secondary:["glute_middle"], tags:["lower"] }),
    autoTertiary({ name:"굿모닝", primary:["hamstring_outer"], secondary:["erector_spinae"], tags:["lower"] }),
    autoTertiary({ name:"브릿지", primary:["hamstring_outer"], secondary:["glute_middle"], tags:["lower"] }),
  ],

  hamstring_inner: [
    autoTertiary({ name:"힙힌지", primary:["hamstring_inner"], secondary:["hamstring_outer"], tags:["lower"] }),
    autoTertiary({ name:"도그포즈 킥", primary:["hamstring_inner"], secondary:["glute_center"], tags:["lower"] }),
    autoTertiary({ name:"레그컬 모션", primary:["hamstring_inner"], secondary:["hamstring_outer"], tags:["lower"] }),
    autoTertiary({ name:"브릿지", primary:["hamstring_inner"], secondary:["hamstring_outer"], tags:["lower"] }),
  ],

  // =======================================================================
  //  📌 9) 종아리 Calves
  // =======================================================================

  calf_outer: [
    autoTertiary({ name:"카프레이즈", primary:["calf_outer"], secondary:["soleus"], tags:["lower"] }),
    autoTertiary({ name:"싱글 카프레이즈", primary:["calf_outer"], secondary:["calf_inner"], tags:["lower"] }),
    autoTertiary({ name:"스탠딩 카프", primary:["calf_outer"], secondary:["glute_middle"], tags:["lower"] }),
    autoTertiary({ name:"홀드 카프", primary:["calf_outer"], secondary:["soleus"], tags:["lower"] }),
  ],

  calf_inner: [
    autoTertiary({ name:"카프레이즈", primary:["calf_inner"], secondary:["soleus"], tags:["lower"] }),
    autoTertiary({ name:"싱글 카프레이즈", primary:["calf_inner"], secondary:["calf_outer"], tags:["lower"] }),
    autoTertiary({ name:"스탠딩 카프", primary:["calf_inner"], secondary:["soleus"], tags:["lower"] }),
    autoTertiary({ name:"내측 카프레이즈", primary:["calf_inner"], secondary:["soleus"], tags:["lower"] }),
  ],

  soleus: [
    autoTertiary({ name:"앉아서 카프레이즈", primary:["soleus"], secondary:["calf_inner"], tags:["lower"] }),
    autoTertiary({ name:"플랫 스탠딩 카프", primary:["soleus"], secondary:["calf_outer"], tags:["lower"] }),
    autoTertiary({ name:"점핑 카프", primary:["soleus"], secondary:["calf_inner"], tags:["lower"] }),
    autoTertiary({ name:"슬로우 카프", primary:["soleus"], secondary:["calf_outer"], tags:["lower"] }),
  ],

};
