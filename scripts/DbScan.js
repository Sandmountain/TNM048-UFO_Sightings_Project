function dbScan(DataOfInt1x,DataOfInt2y, eps, minPts, data)
{
    var clusters = []; //Cluster array we will save each index belonging to a cluster at each index.

    var status = []; //Which cluster a certain index of the data belongs to.
    
    //euclidean_distance function
    function euclidean_distance(dataPoint1, dataPoint2) 
    {
        
        var euc_dist = Math.sqrt(Math.pow((dataPoint2[DataOfInt1x] - dataPoint1[DataOfInt1x]), 2) + Math.pow((dataPoint2[DataOfInt2y] - dataPoint1[DataOfInt2y]), 2));
        return euc_dist;
    }

    //Getting the neighbours of a certain point.
    function get_region_neighbours(point_idx) 
    {
        var neighbours = [];
        var d = data[point_idx];

        for (var i = 0; i < data.length; i++) 
        {
            if (point_idx === i)
            {
                continue;
            }
            if (euclidean_distance(data[i], d) <= eps) 
            {
                neighbours.push(i);
            }
        }
        return neighbours;
    }


    //Function for going through the data and expanding the clusters. This is done recursivly till we have gone through all points that should be a part of the cluster.
    function expand_cluster(point_idx, neighbours, cluster_idx) 
    {
        clusters[cluster_idx - 1].push(point_idx); //adding a point to the current cluster index
        status[point_idx] = cluster_idx;	//Assign the cluster index to the point that was added to the cluster

        for (var i = 0; i < neighbours.length; i++) 
        {
            var curr_point_idx = neighbours[i];

            if (status[curr_point_idx] === undefined) 
            {
                status[curr_point_idx] = 0; //visited and marked as noise by default
                
                var curr_neighbours = get_region_neighbours(curr_point_idx);
                var curr_num_neighbours = curr_neighbours.length;
                
                if (curr_num_neighbours >= minPts) 
                {
                    expand_cluster(curr_point_idx, curr_neighbours, cluster_idx);
                }
            }

            if (status[curr_point_idx] < 1) // not assigned to a cluster but visited (= 0)
            { 
                status[curr_point_idx] = cluster_idx;
                clusters[cluster_idx - 1].push(curr_point_idx);
            }
        }
    }
    

    for (var i = 0; i < data.length; i++) 
    {
        if (status[i] === undefined) {
            
            status[i] = 0; //visited and marked as noise by default
            var neighbours = get_region_neighbours(i);
            var num_neighbours = neighbours.length;
            
            //If a point does not have enough neighbours we mark it as noise.
            if (num_neighbours < minPts) 
            {
                status[i] = 0; //noise
            } 
            else 
            {
                //If a point have enough neighbours we create a new cluster.
                clusters.push([]); //empty new cluster
                var cluster_idx = clusters.length;
                expand_cluster(i, neighbours, cluster_idx);
            }
        }
    }
           
    //Saving all the important cluster data inside the array cluster_centers array 
    var num_clusters = clusters.length;
    var clusters_centers = [];

    for (var i = 0; i < num_clusters; i++) 
    {
        clusters_centers[i] = {x: 0, y: 0};

        for (var j = 0; j < clusters[i].length; j++) 
        {
            clusters_centers[i].x += data[clusters[i][j]][DataOfInt1x];
            clusters_centers[i].y += data[clusters[i][j]][DataOfInt2y];
        }
        
        //Calculating the center point of the cluster
        clusters_centers[i].x /= clusters[i].length; 
        clusters_centers[i].y /= clusters[i].length;

        //The amount of clusters 
        clusters_centers[i].dimension = clusters[i].length;

        //The index of all the datapoints inside the cluster i
        clusters_centers[i].parts = clusters[i];

    }
    //Returning the result of the DBScan
    return clusters_centers;
}