let iterationCounter = 0;

export const Sudoku = function(in_val) {
    if (iterationCounter > 3000) {
        throw new Error('unsolvable');
    }

    iterationCounter++;

    let solved = [];
    let steps = 0;

    initSolved(in_val);
    solve();

    function initSolved(in_val) {
        steps = 0;
        const suggest = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for ( let i=0; i<9; i++) {
            solved[i] = [];
            for (let j=0; j<9; j++ ) {
                if (in_val[i][j]) {
                    solved[i][j] = [in_val[i][j], 'in', []];
                }
                else {
                    solved[i][j] = [0, 'unknown', suggest];
                }
            }
        }
    }

    function solve() {
        let changed = 0;
        do {
            // сужаем множество значений для всех нерешенных чисел
            changed = updateSuggests();
            steps++;
            if (steps > 81) {
                // Зашита от цикла
                break;
            }
        } while (changed);

        if ( !isSolved() && !isFailed() ) {
            backtracking();
        }
    }

    function updateSuggests() {
        let changed = 0;
        let buf = arrayDiff(solved[1][3][2], rowContent(1));
        buf = arrayDiff(buf, colContent(3));
        buf = arrayDiff(buf, sectContent(1, 3));
        for (let i=0; i<9; i++) {
            for (let j=0; j<9; j++) {
                if ( 'unknown' != solved[i][j][1] ) {
                    // Здесь решение либо найдено, либо задано
                    continue;
                }

                // "Одиночка"
                changed += solveSingle(i, j);

                // "Скрытый одиночка"
                // changed += solveHiddenSingle(i, j);
            }
        }
        return changed;
    }; // end of methos updateSuggests()

    function solveSingle(i, j) {
        solved[i][j][2] = arrayDiff(solved[i][j][2], rowContent(i));
        solved[i][j][2] = arrayDiff(solved[i][j][2], colContent(j));
        solved[i][j][2] = arrayDiff(solved[i][j][2], sectContent(i, j));
        if ( 1 == solved[i][j][2].length ) {
            // Исключили все варианты кроме одного
            markSolved(i, j, solved[i][j][2][0]);
            return 1;
        }
        return 0;
    }; // end of method solveSingle()

    function solveHiddenSingle(i, j) {
        let less_suggest = lessRowSuggest(i, j);
        let changed = 0;
        if ( 1 == less_suggest.length ) {
            markSolved(i, j, less_suggest[0]);
            changed++;
        }
        less_suggest = lessColSuggest(i, j);
        if ( 1 == less_suggest.length ) {
            markSolved(i, j, less_suggest[0]);
            changed++;
        }
        less_suggest = lessSectSuggest(i, j);
        if ( 1 == less_suggest.length ) {
            markSolved(i, j, less_suggest[0]);
            changed++;
        }
        return changed;
    }; // end of method solveHiddenSingle()

    function markSolved(i, j, solve) {
        solved[i][j][0] = solve;
        solved[i][j][1] = 'solved';
    }; // end of method markSolved()

    function rowContent(i) {
        var content = [];
        for ( var j=0; j<9; j++ ) {
            if ( 'unknown' != solved[i][j][1] ) {
                content[content.length] = solved[i][j][0];
            }
        }
        return content;
    }; // end of method rowContent()

    function colContent(j) {
        var content = [];
        for ( var i=0; i<9; i++ ) {
            if ( 'unknown' != solved[i][j][1] ) {
                content[content.length] = solved[i][j][0];
            }
        }
        return content;
    }; // end of method colContent()

    function sectContent(i, j) {
        var content = [];
        var offset = sectOffset(i, j);
        for ( var k=0; k<3; k++ ) {
            for ( var l=0; l<3; l++ ) {
                if ( 'unknown' != solved[offset.i+k][offset.j+l][1] ) {
                    content[content.length] = solved[offset.i+k][offset.j+l][0];
                }
            }
        }
        return content;
    }; // end of method sectContent()

    function lessRowSuggest(i, j) {
        var less_suggest = solved[i][j][2];
        for ( var k=0; k<9; k++ ) {
            if ( k == j || 'unknown' != solved[i][k][1] ) {
                continue;
            }
            less_suggest = arrayDiff(less_suggest, solved[i][k][2]);
        }
        return less_suggest;
    }; // end of method lessRowSuggest()

    function lessColSuggest(i, j) {
        var less_suggest = solved[i][j][2];
        for ( var k=0; k<9; k++ ) {
            if ( k == i || 'unknown' != solved[k][j][1] ) {
                continue;
            }
            less_suggest = arrayDiff(less_suggest, solved[k][j][2]);
        }
        return less_suggest;
    }; // end of method lessColSuggest()

    function lessSectSuggest(i, j) {
        var less_suggest = solved[i][j][2];
        var offset = sectOffset(i, j);
        for ( var k=0; k<3; k++ ) {
            for ( var l=0; l<3; l++ ) {
                if ( ((offset.i+k) == i  && (offset.j+l) == j)|| 'unknown' != solved[offset.i+k][offset.j+l][1] ) {
                    continue;
                }
                less_suggest = arrayDiff(less_suggest, solved[offset.i+k][offset.j+l][2]);
            }
        }
        return less_suggest;
    }; // end of method lessSectSuggest()

    function arrayDiff (ar1, ar2) {
        var arr_diff = [];
        for ( var i=0; i<ar1.length; i++ ) {
            var is_found = false;
            for ( var j=0; j<ar2.length; j++ ) {
                if ( ar1[i] == ar2[j] ) {
                    is_found = true;
                    break;
                }
            }
            if ( !is_found ) {
                arr_diff[arr_diff.length] = ar1[i];
            }
        }
        return arr_diff;
    }; // end of method arrayDiff()

    function arrayUnique(ar){
        var sorter = {};
        for(var i=0,j=ar.length;i<j;i++){
            sorter[ar[i]] = ar[i];
        }
        ar = [];
        for(var i in sorter){
            ar.push(i);
        }
        return ar;
    }; // end of method arrayUnique()

    function sectOffset(i, j) {
        return {
            j: Math.floor(j/3)*3,
            i: Math.floor(i/3)*3
        };
    }; // end of method sectOffset()

    function isSolved() {
        var is_solved = true;
        for ( var i=0; i<9; i++) {
            for ( var j=0; j<9; j++ ) {
                if ( 'unknown' == solved[i][j][1] ) {
                    is_solved = false;
                }
            }
        }
        return is_solved;
    }; // end of method isSolved()

    this.isSolved = function() {
        return isSolved();
    }; // end of public method isSolved()

    function isFailed() {
        var is_failed = false;
        for ( var i=0; i<9; i++) {
            for ( var j=0; j<9; j++ ) {
                if ( 'unknown' == solved[i][j][1] && !solved[i][j][2].length ) {
                    is_failed = true;
                }
            }
        }
        return is_failed;
    }; // end of method isFailed()

    this.isFailed = function() {
        return isFailed();
    }; // end of public method isFailed()

    function backtracking() {
        // Формируем новый массив
        const in_val = [[], [], [], [], [], [], [], [], []];
        let i_min=-1, j_min=-1, suggests_cnt=0;
        for ( let i=0; i<9; i++ ) {
            in_val[i].length = 9;
            for ( let j=0; j<9; j++ ) {
                in_val[i][j] = solved[i][j][0];
                if ( 'unknown' == solved[i][j][1] && (solved[i][j][2].length < suggests_cnt || !suggests_cnt) ) {
                    suggests_cnt = solved[i][j][2].length;
                    i_min = i;
                    j_min = j;
                }
            }
        }

        // проходим по всем элементам, находим нерешенные,
        // выбираем кандидата и пытаемся решить
        for ( let k=0; k<suggests_cnt; k++ ) {
            in_val[i_min][j_min] = solved[i_min][j_min][2][k];
            let sudoku;
            // инициируем новый цикл
            try {
                sudoku = new Sudoku(in_val);
            } catch(err) {
                iterationCounter = 0;
                throw new Error('unsolvable')
            }

            if (sudoku.isSolved()) {
                // нашли решение
                const out_val = sudoku.solved();
                // Записываем найденное решение
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        if ('unknown' == solved[i][j][1]) {
                            markSolved(i, j, out_val[i][j][0])
                        }
                    }
                }
                return;
            }
        }
    }

    this.solved = function() {
        return solved;
    }
}
