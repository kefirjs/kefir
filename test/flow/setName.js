/* @flow */

import Kefir from '../../kefir';
import type {Observable} from '../../kefir';

const s1: Observable<number> = Kefir.constant(1);

s1.setName('s1');
// $ExpectError
s1.setName();

const s2: Observable<string> = Kefir.constant('one');
s1.setName(s2, 's1');
// $ExpectError
s1.setName(s2);
