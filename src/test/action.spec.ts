import {
  describe,
  expect,
  test
} from '@jest/globals'

describe('Action unit tests', () => {
  test('hola', () => {
    expect(1).toBe(1)
  })
})

/* import { expect } from 'chai'
import {
  beforeEach,
  describe,
  it
} from 'jest'
import * as sinon from 'sinon'

import { Action } from '../modules/actions/action'

class ActionChild extends Action<any, any> {
  onPlay() {}
  onStop() {}
}

describe('Action class', function () {
  let actionClass
  beforeEach(function () {
    actionClass = new ActionChild('id', null)
  })

  it('Method \'play\'', function () {
    const spyOnPlay = sinon.spy(actionClass, 'onPlay')
    actionClass.play()
    expect(spyOnPlay.calledOnce).to.be.true
  })
})
*/
