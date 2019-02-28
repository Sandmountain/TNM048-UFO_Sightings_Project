function Points()
{
    
    this.plot = function(selected_data)
    {
        selected_data
                .attr('r', function(d)
                {
                    return 50;
                })
                .attr('fill', function(d)
                {
                    return "#ff0000";
                })
                
    }
}