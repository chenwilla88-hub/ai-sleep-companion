# Database Schema Draft

## User

- id
- email
- display_name
- created_at

## SleepSession

- id
- user_id
- start_time
- end_time
- state_input
- ai_state_summary
- status

## SleepFeedback

- id
- session_id
- score
- label
- text_reason
- created_at

## SleepProfile

- id
- user_id
- preference_weights
- state_patterns
- updated_at

## SoundAsset

- id
- name
- category
- file_url
- tags
- loopable
- default_volume

## SoundProfile

- id
- session_id
- profile_json
- recommendation_reason
- version

## SoundMix

- id
- sound_profile_id
- timeline_json
- total_duration
- master_volume_curve

## AIConversation

- id
- user_id
- session_id
- role
- content
- created_at
