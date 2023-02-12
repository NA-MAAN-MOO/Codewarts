export type Event = React.ChangeEvent<HTMLInputElement>;

export type SessionEvent =
  | 'connectionCreated'
  | 'connectionDestroyed'
  | 'connectionPropertyChanged'
  | 'exception'
  | 'networkQualityLevelChanged'
  | 'publisherStartSpeaking'
  | 'publisherStopSpeaking'
  | 'reconnected'
  | 'reconnecting'
  | 'recordingStarted'
  | 'recordingStopped'
  | 'sessionDisconnected'
  | 'signal'
  | 'speechToTextMessage'
  | 'streamCreated'
  | 'streamDestroyed'
  | 'streamPropertyChanged';
