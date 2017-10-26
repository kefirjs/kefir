/* @flow */

import Kefir from '../../kefir'
import type {Observable} from '../../kefir'

const obs: Observable<string> = Kefir.constant('hello')

const good: boolean = obs.thru((x: Observable<string>): boolean => true)

// $ExpectError
const bad1: boolean = obs.thru((x: Observable<number>): boolean => true)

// $ExpectError
const bad2: string = obs.thru((x: Observable<string>): boolean => true)
