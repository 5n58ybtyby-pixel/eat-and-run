export const store = { workoutPost: null, recipePost: null }

const _prev = localStorage.getItem('demoUser')
export const DEMO_USER = _prev === 'sara'
  ? { name: 'Sara',    surname: 'Weber',  handle: '@sarafit',    initials: 'SW', greeting: 'Sara' }
  : { name: 'Patrick', surname: 'Müller', handle: '@patricklauf', initials: 'PM', greeting: 'Patrick' }
localStorage.setItem('demoUser', _prev === 'sara' ? 'patrick' : 'sara')
