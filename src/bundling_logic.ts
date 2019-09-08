import Line from "./line";
import { Chain } from "./parser";

export const BUNDLING_KEY = '___bundle___';

export const BUNDLING_GROUPS = [
  // text commands
  [
    'say',
  ],

  // movement commands
  [
    'face_down',
    'face_up',
    'face_left',
    'face_right',
    'walk_slow_down',
    'walk_slow_up',
    'walk_slow_left',
    'walk_slow_right',
    'walk_down',
    'walk_up',
    'walk_left',
    'walk_right',
    'jump_2_down',
    'jump_2_up',
    'jump_2_left',
    'jump_2_right',
    'delay_1',
    'delay_2',
    'delay_4',
    'delay_8',
    'delay_16',
    'walk_fast_down',
    'walk_fast_up',
    'walk_fast_left',
    'walk_fast_right',
    'walk_in_place_slow_down',
    'walk_in_place_slow_up',
    'walk_in_place_slow_left',
    'walk_in_place_slow_right',
    'walk_in_place_down',
    'walk_in_place_up',
    'walk_in_place_left',
    'walk_in_place_right',
    'walk_in_place_fast_down',
    'walk_in_place_fast_up',
    'walk_in_place_fast_left',
    'walk_in_place_fast_right',
    'walk_in_place_fastest_down',
    'walk_in_place_fastest_up',
    'walk_in_place_fastest_left',
    'walk_in_place_fastest_right',
    'ride_water_current_down',
    'ride_water_current_up',
    'ride_water_current_left',
    'ride_water_current_right',
    'walk_fastest_down',
    'walk_fastest_up',
    'walk_fastest_left',
    'walk_fastest_right',
    'slide_down',
    'slide_up',
    'slide_left',
    'slide_right',
    'player_run_down',
    'player_run_up',
    'player_run_left',
    'player_run_right',
    'start_anim_in_direction',
    'jump_special_down',
    'jump_special_up',
    'jump_special_left',
    'jump_special_right',
    'face_player',
    'face_away_player',
    'lock_facing_direction',
    'unlock_facing_direction',
    'jump_down',
    'jump_up',
    'jump_left',
    'jump_right',
    'jump_in_place_down',
    'jump_in_place_up',
    'jump_in_place_left',
    'jump_in_place_right',
    'jump_in_place_down_up',
    'jump_in_place_up_down',
    'jump_in_place_left_right',
    'jump_in_place_right_left',
    'face_original_direction',
    'nurse_joy_bow',
    'enable_jump_landing_ground_effect',
    'disable_jump_landing_ground_effect',
    'disable_anim',
    'restore_anim',
    'set_invisible',
    'set_visible',
    'emote_exclamation_mark',
    'emote_question_mark',
    'emote_heart',
    'reveal_trainer',
    'rock_smash_break',
    'cut_tree',
    'set_fixed_priority',
    'clear_fixed_priority',
    'init_affine_anim',
    'clear_affine_anim',
    'unknown_movement_1',
    'unknown_movement_2',
    'walk_down_start_affine',
    'walk_down_affine',
    'walk_diag_northwest',
    'walk_diag_northeast',
    'walk_diag_southwest',
    'walk_diag_southeast',
    'walk_slow_diag_northwest',
    'walk_slow_diag_northeast',
    'walk_slow_diag_southwest',
    'walk_slow_diag_southeast',
    'store_lock_anim',
    'free_unlock_anim',
    'walk_left_affine',
    'walk_right_affine',
    'levitate',
    'stop_levitate',
    'destroy_extra_task',
    'figure_8',
    'fly_up',
    'fly_down',
    'step_end',
  ],
];

function getBundlingIndex(command: string): number {
  for (let i = 0; i < BUNDLING_GROUPS.length; i++) {
    if (BUNDLING_GROUPS[i].includes(command)) {
      return i;
    }
  }
  // return NaN so they don't compare equality, rather than having to also check against -1 or undefined
  return NaN;
}

function shouldBeBundled(lastLine: Line, currentLine: Line): boolean {
  if (!lastLine || !currentLine) {
    return false;
  }

  // this is already a bundle, check and then add it in
  if (lastLine.command === BUNDLING_KEY) {
    if (lastLine.bundlingGroup === getBundlingIndex(currentLine.command)) {
      return true;
    }
  // the last line is NOT currently a bundle
  } else {
    if (getBundlingIndex(lastLine.command) === getBundlingIndex(currentLine.command)) {
      return true;
    }
  }
  return false;
}

export function tryBundleLines(lastLine: Line, currentLine: Line): boolean {
  if (!shouldBeBundled(lastLine, currentLine)) {
    return false;
  }

  // if the last line is a bundle, add it on
  if (lastLine.command === BUNDLING_KEY) {
    lastLine.children.push(currentLine);
  } else {
    const lastLineDup = { ...lastLine };
    lastLine.bundlingGroup = getBundlingIndex(lastLine.command)
    lastLine.command = BUNDLING_KEY;
    lastLine.children = [lastLineDup, currentLine];
    delete lastLine.parameters;
  }

  return true;
}