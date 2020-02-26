const Rock = function (size, scene) {

    var rock = new BABYLON.Mesh("rock", scene);

    var vertexData = BABYLON.VertexData.CreateSphere({segments: 2, diameter: size});
    vertexData.applyToMesh(rock, false);

    var positions = rock.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var indices = rock.getIndices();
    var numberOfPoints = positions.length / 3;

    var map = [];

    // The higher point in the sphere
    var v3 = BABYLON.Vector3;
    var max = [];

    for (var i = 0; i < numberOfPoints; i++) {
        var p = new v3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);

        if (p.y >= size / 2) {
            max.push(p);
        }

        var found = false;
        for (var index = 0; index < map.length && !found; index++) {
            var array = map[index];
            var p0 = array[0];
            if (p0.equals(p) || (p0.subtract(p)).lengthSquared() < 0.01) {
                array.push(i * 3);
                found = true;
            }
        }
        if (!found) {
            var array = [];
            array.push(p, i * 3);
            map.push(array);
        }

    }
    var randomNumber = function (min, max) {
        if (min == max) {
            return (min);
        }
        var random = Math.random();
        return ((random * (max - min)) + min);
    };

    map.forEach(function (array) {
        var index, min = -size / 10, max = size / 10;
        var rx = randomNumber(min, max);
        var ry = randomNumber(min, max);
        var rz = randomNumber(min, max);

        for (index = 1; index < array.length; index++) {
            var i = array[index];
            positions[i] += rx;
            positions[i + 1] += ry;
            positions[i + 2] += rz;
        }
    });

    rock.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    var normals = [];
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);
    rock.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
    rock.convertToFlatShadedMesh();

    rock.material = new BABYLON.StandardMaterial("", scene);
    rock.material.diffuseColor = BABYLON.Color3.Random();
    rock.material.specularColor = BABYLON.Color3.Black();
    rock.position.y = 0;

    rock.isPickable = true;
    rock.checkCollisions = true;

    return rock;
};

module.exports = Rock;
