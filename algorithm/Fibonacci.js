/**
 * 求斐波那契数列的第n项
 * @param {number} n 
 */
function Fibonacci(n) {
    // 1, 1, 2, 3, 5, 8
    if (n === 1 || n === 2) return 1
    return Fibonacci(n - 1) + Fibonacci(n - 2)
}

