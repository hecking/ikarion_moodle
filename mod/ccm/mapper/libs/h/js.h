/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

#define extend(sub, super) ist.extend(sub, super)

#define printf(str) console.log(str)

#define assert_number(x) { if (!(typeof(x)!=='number')) { printf('assert: ' + __FILE__ + ': ' + __LINE__ + ' ' + #x + ' - ' + x); return null;} }

#define assert(x) { if (!(x)) { printf('assert: ' + __FILE__ + ': ' + __LINE__ + ' ' + #x + ' - ' + x); return null;} }

#define assert_defined(x) { if (!(x)) { printf('undefined: ' + __FILE__ + ': ' + __LINE__ + ' ' + #x + ' - ' + x); return null;} }

#define assert_class(obj, cl) { if (!(obj instanceof cl)) { printf('assert: ' + __FILE__ + ': ' + __LINE__ + ' ' + #obj + ' not a ' + #cl); return null;} }

#define throw(x) { printf('throw: ' + __FILE__ + ': ' + __LINE__ + ' ' + x); return null;}

#define default(val, def) (val === undefined ? def : val)

#define accessor(Class, Var) Class.prototype.Var = function(v0) { \
    if (v0 === undefined) \
      return this._##Var; \
    this._##Var = v0; \
    return this; \
}

#define accessor_scope(Class, Var) Class.prototype.Var = function(v0) { \
    if (v0 === undefined) \
      return this._scope.Var; \
    this._scope.Var = v0;          \
    return this; \
}

#define accessor_compute(Class, Var) Class.prototype.Var = function(v0) { \
    if (v0 === undefined) \
      return this._##Var; \
    if (this._##Var !== v0) { this._##Var = v0; this.request_compute(); }  \
    return this; \
}

#define accessor_read(Class, Var) Class.prototype.Var = function() { \
    return this._##Var; \
}

#define delegate_read(Class, Delegate, Var) Class.prototype.Var = function() { \
    return this.Delegate().Var();                                   \
}

#define accessor_write(Class, Var) Class.prototype.Var = function(v0) { \
    this._##Var = v0; \
    return this; \
}

#define forall(Var, Array, Value) for (var Value, Var=0; Value=Array[Var], Var<Array.length; Var++)



