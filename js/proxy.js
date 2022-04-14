//https://www.youtube.com/watch?v=mSbyhHfxs04&list=PLqKQF2ojwm3l4oPjsB9chrJmlhZ-zOzWT&index=10
//Wrapper
// const withDefaultValue = (target, defaultValue = 0) => new Proxy(target, {
//     get: (obj, prop) => (prop in obj) ? obj[prop] : defaultValue
// })

// const position = withDefaultValue({
//     x: 24,
//     y: 42
// }, 0)

const withDefaultValue = function (target, defaultValue = 0) {
    return new Proxy(target, {
        get: function (obj, prop) {
            return (prop in obj) ? obj[prop] : defaultValue
        }
    })
}
const position = withDefaultValue({
    x: 11,
    y: 42
}, 0)

//Hidden properties
const withHiddenProps = (target, prefix = '_') => {
    return new Proxy(target, {
        has: (obj, prop) => (prop in obj) && (!prop.startsWith(prefix)),
        ownKeys: obj => Reflect.ownKeys(obj).filter(p => !p.startsWith(prefix)),
        get: (obj, prop, receiver) => (prop in receiver) ? obj[prop] : void 0
    })
}

const data = withHiddenProps({
    name: 'Ivan',
    age: 26,
    _uid: '12412414'
})

//Optimization
// const userData = [
//     { id: 1, name: 'Ivan', job: 'Fullstack', age: 26 },
//     { id: 2, name: 'Elena', job: 'Student', age: 22 },
//     { id: 3, name: 'Viktor', job: 'Backend', age: 23 },
//     { id: 4, name: 'Vasilisa', job: 'Teacher', age: 24 }
// ]

const IndexedArray = new Proxy(Array, {
    construct(target, [args]) {
        const index = {}
        args.forEach(item => (index[item.id] = item))

        return new Proxy(new target(...args), {
            get(arr, prop) {
                switch (prop) {
                    case 'push':
                        return item => {
                            index[item.id] = item
                            arr[prop].call(arr, item)
                        }
                    case 'findById':
                        return id => index[id]
                    default:
                        return arr[prop]
                }
            }
        })
    }
})

const users = new IndexedArray([
    { id: 1, name: 'Ivan', job: 'Fullstack', age: 26 },
    { id: 2, name: 'Elena', job: 'Student', age: 22 },
    { id: 3, name: 'Viktor', job: 'Backend', age: 23 },
    { id: 4, name: 'Vasilisa', job: 'Teacher', age: 24 }
])